import { Component, ViewChild, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventChangeArg, EventClickArg, EventSourceInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import rrulePlugin from '@fullcalendar/rrule'
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CrxCalendarService } from 'src/app/services/crx-calendar.service';

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
    initialView: 'dayGridMonth',
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventChange: this.handleEventChange.bind(this),
    editable: true,
    selectable: true,
  };

  constructor(
    private calendarS: CrxCalendarService
  ) {
    this.loadDatas()
  }

  ngOnInit(): void {
    console.log("CalendarComponent ngOnInit called")
  }

  loadDatas(): void {
    this.calendarS.get().subscribe(
      (val) => {
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
