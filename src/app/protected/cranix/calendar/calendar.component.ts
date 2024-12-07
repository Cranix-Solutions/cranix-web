import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { GestureController } from '@ionic/angular';
import { CalendarOptions, DateSelectArg, EventChangeArg, EventClickArg, EventSourceInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import multiMonthPlugin from '@fullcalendar/multimonth'
import rrulePlugin from '@fullcalendar/rrule'
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { RRule } from 'rrule';
import { CrxCalendarService } from 'src/app/services/crx-calendar.service';
import { AuthenticationService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { CrxCalendar, Group, RecRule, Room } from 'src/app/shared/models/data-model';
import { UsersService } from 'src/app/services/users.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { UtilsService } from 'src/app/services/utils.service';

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
      multiMonthPlugin,
      rrulePlugin,
      timeGridPlugin,
    ],
    customButtons: {
      selectCalendar: {
        text: this.lanaguageS.trans('Calendar'),
        click: this.selectCalendar.bind(this)
      },
      addEvent: {
        text: "+",
        click: this.handleDateSelect.bind(this)
      },
      importTimetable: {
        text: "Import",
        hint: this.lanaguageS.trans('Import timetable from WebUntis'),
        click: this.importTimetable.bind(this)
      }
    },
    headerToolbar: {
      left: 'prev,next today selectCalendar',
      center: 'title',
      right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay,listWeek addEvent'
    },
    buttonText: {
      year: this.lanaguageS.trans('year'),
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
  addEditEventTitle: string
  eventRecurring: boolean = false
  recurringUntil: string = ""
  isCalendarModalOpen: boolean = false
  isModalOpen: boolean = false
  isImportModalOpen: boolean = false
  fileToUpload: File = null
  importTimeTableHash = {}
  rruleFrequents = [
    'YEARLY',
    'MONTHLY',
    'WEEKLY',
    'DAILY',
    'HOURLY',
    'MINUTELY'
  ]
  rruleDays = [ 'MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']
  rruleMonths = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  rRule = new RecRule()
  myGroups: Group[]
  selectedEvent: CrxCalendar
  eventFilter = {
    rooms:  [],
    groups: [],
    showPrivate: false,
    showIndividual: false
  }

  constructor(
    public objectService: GenericObjectService,
    public authService: AuthenticationService,
    private calendarS: CrxCalendarService,
    private el: ElementRef,
    private gestureCtrl: GestureController,
    private lanaguageS: LanguageService,
    private utilsService: UtilsService,
    private userS: UsersService,
  ) {
    this.loadData()
  }

  ngOnInit(): void {
    console.log("CalendarComponent ngOnInit called")
    if (this.authService.isMD()) {
      this.initializeSwipeGesture();
      this.calendarOptions.headerToolbar =  {
        left: 'today',
        center: 'title',
        right: 'selectCalendar addEvent'
      }
      this.calendarOptions.footerToolbar =  {
        left: '',
        right: '',
        center: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      }
    }
    if( this.authService.isAllowed('calendar.manage')) {
      this.calendarOptions.headerToolbar =  {
        left: 'prev,next today selectCalendar',
      center: 'title',
      right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay,listWeek addEvent importTimetable'
      }
    }
  }

  selectCalendar() {
    this.isCalendarModalOpen = true
  }
  loadData(): void {
    this.calendarS.get().subscribe((val1) => {
      let tmp: CrxCalendar[]= []
      for(let event of val1){
        if(event.rrule == "") {
          delete(event.rrule)
        }
        tmp.push(event)
      }
      this.events = tmp
      console.log(this.events)
    })
    this.userS.getUsersGroups(this.authService.session.userId).subscribe(
      (val) => { this.myGroups = val })
  }

  filterEvents(doFilter: boolean){
    this.isCalendarModalOpen = false
    if(doFilter) {
      console.log(this.eventFilter)
      this.calendarS.getFiltered(this.eventFilter).subscribe((val) => {
        let tmp: CrxCalendar[]= []
        for(let event of val){
          if(event.rrule == "") {
            delete(event.rrule)
          }
          tmp.push(event)
        }
        this.events = tmp
        console.log(this.events)
      })
    } else {
      this.loadData()
      this.eventFilter.groups = []
      this.eventFilter.rooms = []
      this.eventFilter.showIndividual = true
      this.eventFilter.showPrivate = true
    }
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
    const threshold = 50; // Mindestdistanz für einen Swipe
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
  isCalendarSelected(event: any) {
    //console.log(event)
    //If no selection everything is showed
    if( this.eventFilter.groups.length == 0 && this.eventFilter.rooms.length == 0) return true;
    //Private and individual events are sowed everytime
    //event._def.extendedProps.groups
    //event._def.extendedProps.room
    //event._def.extendedProps.category
    let crxEvent = event._def.extendedProps;
    if (crxEvent.category == 'private' || crxEvent.category == 'individual') return true;
    for (let a of crxEvent.groups) {
      if (this.eventFilter.groups.includes(a)) return true;
    }
    if(this.eventFilter.rooms.includes(crxEvent.room)) return true;
    return false;
  }
  adaptEventTimes() {
    if (this.selectedEvent.allDay) {
      this.selectedEvent.start = this.utilsService.toIonDate(new Date(this.selectedEvent.start))
      this.selectedEvent.end = this.utilsService.toIonDate(new Date(this.selectedEvent.end))
    } else {
      this.selectedEvent.start = this.utilsService.toIonISOString(new Date(this.selectedEvent.start))
      this.selectedEvent.end = this.utilsService.toIonISOString(new Date(this.selectedEvent.end))
    }
  }
  handleDateSelect(arg: DateSelectArg) {
    let start = new Date()
    let end = new Date()
    if( arg != null && arg.start != null ){
      if(arg.start.getTime() < start.getTime()){
        this.objectService.errorMessage("You can not create event in the past.")
        return
      }
      start = arg.start
      end = arg.end
    }
    this.addEditEventTitle = "Add new event"
    this.selectedEvent = new CrxCalendar();
    this.selectedEvent.start = start
    this.selectedEvent.end = end
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
    console.log(this.calendarComponent.options.selectable)
    this.addEditEventTitle = "Edit event"
    this.calendarS.getById(arg.event.id).subscribe((val) => {
      this.selectedEvent = val
      if( val.rrule && val.rrule != "") {
        console.log(this.selectedEvent)
        this.selectedEvent.start = arg.event.startStr
        this.selectedEvent.end = arg.event.endStr
        let rule = RRule.fromString(val.rrule)
        this.recurringUntil = this.utilsService.toIonDate(rule.options.until)
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
        this.adaptEventTimes()
      }
      this.setOpen(true)
    })
    console.log(arg.event.id)
  }
  handleEventChange(arg: EventChangeArg) {
    this.calendarS.getById(arg.event.id).subscribe((val) => {
      val.start = arg.event._instance?.range.start
      val.end = arg.event._instance?.range.end
      this.calendarS.modify(val).subscribe((val2) => {
        this.loadData()
        this.objectService.responseMessage(val2)
      })
    })
    console.log(arg.event._instance?.range)
  }

  addEditEvent(modal: any) {
    modal.dismiss()
    this.objectService.requestSent()
    console.log(this.selectedEvent)
    this.selectedEvent.start = new Date(this.selectedEvent.start)
    this.selectedEvent.end = new Date(this.selectedEvent.end)
    if (this.eventRecurring) {
      this.rRule.dtstart = this.selectedEvent.start
      console.log(this.rRule)
      if(this.rRule.count == 0) {
        delete(this.rRule.count)
      }
      if(this.recurringUntil != "") {
        this.rRule.until = new Date(this.recurringUntil)
      }
      let rule = new RRule(this.rRule)
      this.selectedEvent['rrule'] = rule.toString()
      this.recurringUntil = ""
      this.eventRecurring = false
      this.rRule = new RecRule()
    }
    this.setOpen(false)
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

  deleteEvent(){
    this.setOpen(false)
    this.objectService.requestSent()
    this.calendarS.delete(this.selectedEvent).subscribe(
      (val) => {
        this.loadData()
        this.objectService.responseMessage(val)
      }
    )
  }

  importTimetable(){
    this.fileToUpload = null
    this.importTimeTableHash['start'] = ""
    this.importTimeTableHash['end'] = ""
    this.isImportModalOpen = true
  }

  onFilesAdded(event) {
    this.fileToUpload = event.target.files.item(0);
  }

  doImportTimetable(){
    let formData: FormData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
    let start = this.importTimeTableHash['start'].replace(/-/g,'');
    let end = this.importTimeTableHash['end'].replace(/-/g,'');

    formData.append('start', start);
    formData.append('end', end);
    this.fileToUpload = null
    this.objectService.requestSent()
    this.calendarS.importTimeTable(formData).subscribe(
      (val) => {
        this.loadData()
        this.objectService.responseMessage(val)
        this.isImportModalOpen = false
      }
    )
  }
}
