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
      today:    this.lanaguageS.trans('today'),
      month:    this.lanaguageS.trans('month'),
      week:     this.lanaguageS.trans('week'),
      day:      this.lanaguageS.trans('day'),
      list:     this.lanaguageS.trans('list')
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

  constructor(
    private authS: AuthenticationService,
    private calendarS: CrxCalendarService,
    private gestureCtrl: GestureController,
    private lanaguageS: LanguageService,
    private el: ElementRef
  ) {
    this.loadDatas()
  }

  ngOnInit(): void {
    console.log("CalendarComponent ngOnInit called")
    if( this.authS.isMD() ){
      this.initializeSwipeGesture();
    }
    const rule = new RRule({
      freq: RRule.WEEKLY,
      byweekday: [ 0 ],
      dtstart: new Date()
    })
    console.log(rule.toString())
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
    console.log('handleSwipe called')
    if (event.deltaX > threshold) {
      console.log('go back')
      this.calendarComponent.getApi().prev();
    } else if (event.deltaX < -threshold) {
      console.log('go ahead')
      this.calendarComponent.getApi().next();
    }
  }

  loadDatas(): void {
    this.calendarS.get().subscribe(
      (val) => {
        console.log(val)
        this.events = val
    })
  }

  handleDateSelect(arg: DateSelectArg) {
    console.log(arg)
  }
  handleEventClick(arg: EventClickArg) {
    console.log(arg.event.id)
  }
  handleEventChange(arg: EventChangeArg) {
    console.log(arg.event._instance?.range)
  }
}
