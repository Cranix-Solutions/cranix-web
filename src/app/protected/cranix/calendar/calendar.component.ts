import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { GestureController } from '@ionic/angular';
import { CalendarOptions, DateSelectArg, EventChangeArg, EventClickArg, EventSourceInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import rrulePlugin from '@fullcalendar/rrule'
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { RRule } from 'rrule';
import { CrxCalendarService } from 'src/app/services/crx-calendar.service';
import { AuthenticationService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { CrxCalendar, Group, RecRule } from 'src/app/shared/models/data-model';
import { UsersService } from 'src/app/services/users.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';

@Component({
  selector: 'crx-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent | undefined;
  events: any[] = []
  calendarOptions: CalendarOptions = {
    locale: 'de',
    height: "100%",
    plugins: [
      dayGridPlugin,
      interactionPlugin,
      listPlugin,
      rrulePlugin,
      timeGridPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    buttonText: {
      today: this.lanaguageS.trans('today'),
      month: this.lanaguageS.trans('month'),
      week: this.lanaguageS.trans('week'),
      day: this.lanaguageS.trans('day'),
      list: this.lanaguageS.trans('list')
    },
    firstDay: 1,
    initialView: 'dayGridMonth',
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventChange: this.handleEventChange.bind(this),
    editable: true,
    selectable: true,
    weekNumbers: true
  };
  eventRecurring: boolean = false
  isModalOpen: boolean = false
  double = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09']
  rruleFrequents = [
    'YEARLY',
    'MONTHLY',
    'WEEKLY',
    'DAILY',
    'HOURLY',
    'MINUTELY',
    'SECONDLY'
  ]
  rruleDays = [ 'MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']
  rruleMonths = [ '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  rRule = new RecRule()
  myGroups: Group[]
  selectedEvent: CrxCalendar

  constructor(
    public objectService: GenericObjectService,
    private authService: AuthenticationService,
    private calendarS: CrxCalendarService,
    private el: ElementRef,
    private gestureCtrl: GestureController,
    private lanaguageS: LanguageService,
    private userS: UsersService,
  ) {
    this.loadData()
  }

  ngOnInit(): void {
    console.log("CalendarComponent ngOnInit called")
    if (this.authService.isMD()) {
      this.initializeSwipeGesture();
    }
    const rule = new RRule({
      freq: RRule.WEEKLY,
      byweekday: [0],
      dtstart: new Date()
    })
    console.log(rule.toString())
  }


  loadData(): void {
    this.calendarS.get().subscribe((val) => { this.events = val })
    this.userS.getUsersGroups(this.authService.session.userId).subscribe(
      (val) => { this.myGroups = val })
  }

  //Handle Swipe
  initializeSwipeGesture() {
    const gesture = this.gestureCtrl.create({
      el: this.el.nativeElement,
      gestureName: 'swipe',
      onMove: (ev) => this.handleSwipe(ev),
    });
    gesture.enable();
  }

  handleSwipe(event) {
    const threshold = 100; // Mindestdistanz für einen Swipe
    if (event.deltaX > threshold) {
      this.calendarComponent.getApi().prev();
    } else if (event.deltaX < -threshold) {
      this.calendarComponent.getApi().next();
    }
  }
  isWritable() {
    if (this.selectedEvent) {
      //New event
      if (!this.selectedEvent.id) return true;
      //Owned event
      if (this.selectedEvent.creatorId == this.authService.session.userId) return true;
      //TODO additional rights.
    }
    return false;
  }
  getDouble(num: number) {
    if (this.double[num]) return this.double[num]
    return num
  }
  toIonISOString(dt: Date | undefined) {
    if (dt) {
      return dt.getFullYear() + "-" +
        this.getDouble(dt.getMonth() + 1) + "-" +
        this.getDouble(dt.getDate()) + "T" +
        this.getDouble(dt.getHours()) + ":" +
        this.getDouble(dt.getMinutes())
    }
    return ""
  }

  toIonDate(dt: Date | undefined) {
    if (dt) {
      return dt.getFullYear() + "-" +
        this.getDouble(dt.getMonth() + 1) + "-" +
        this.getDouble(dt.getDate())
    }
    return ""
  }
  adaptEventTimes() {
    if (this.selectedEvent.allDay) {
      this.selectedEvent.start = this.toIonDate(new Date(this.selectedEvent.start))
      this.selectedEvent.end = this.toIonDate(new Date(this.selectedEvent.end))
    } else {
      this.selectedEvent.start = this.toIonISOString(new Date(this.selectedEvent.start))
      this.selectedEvent.end = this.toIonISOString(new Date(this.selectedEvent.end))
    }
  }
  handleDateSelect(arg: DateSelectArg) {
    this.selectedEvent = new CrxCalendar();
    this.selectedEvent.start = arg.start
    this.selectedEvent.end = arg.end
    this.adaptEventTimes()
    this.setOpen(true)
    console.log(arg)
  }
  setOpen(open: boolean) {
    this.isModalOpen = open
    if(!open) {
      this.eventRecurring = false
    }
  }
  handleEventClick(arg: EventClickArg) {
    this.calendarS.getById(arg.event.id).subscribe((val) => {
      this.selectedEvent = val
      if( val.rrule != "") {
        console.log(this.selectedEvent)
        let rule = RRule.fromString(val.rrule)
        console.log(rule.options)
        this.rRule = rule.options
        /*this.rRule.bymonth = rule.options.bymonth
        this.rRule.byweekday = rule.options.byweekday
        this.rRule.dtstart = rule.options.dtstart
        this.rRule.freq = rule.options.freq
        this.rRule.interval = rule.options.interval
        this.rRule.until = rule.options.until*/
        this.eventRecurring = true
      } else {
        this.rRule = new RecRule()
        this.eventRecurring = false
      }
      this.adaptEventTimes()
      this.setOpen(true)
    })
    console.log(arg.event.id)
  }
  handleEventChange(arg: EventChangeArg) {
    console.log(arg.event._instance?.range)
  }
  addEditEvent(modal: any) {
    modal.dismiss()
    this.setOpen(false)
    this.objectService.requestSent()
    this.selectedEvent.start = new Date(this.selectedEvent.start)
    this.selectedEvent.end = new Date(this.selectedEvent.end)
    if (this.eventRecurring) {
      this.rRule.dtstart = this.selectedEvent.start
      this.selectedEvent['duration'] = this.selectedEvent.end.getTime() - this.selectedEvent.start.getTime()
      let rule = new RRule(this.rRule)
      this.selectedEvent['rrule'] = rule.toString()
    }
    console.log(this.selectedEvent)
    if (this.selectedEvent.id) {
      this.calendarS.modify(this.selectedEvent).subscribe(
        (val) => {
          this.loadData()
          this.objectService.responseMessage(val)
        }
      )
    } else {
      this.calendarS.add(this.selectedEvent).subscribe(
        (val) => {
          this.loadData()
          this.objectService.responseMessage(val)
        }
      )
    }
  }
}
