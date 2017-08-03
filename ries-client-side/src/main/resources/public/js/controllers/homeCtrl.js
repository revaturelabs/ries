app.controller("homeCtrl", function(moment, calendarConfig, requisitionService, globalVarService){

    var vm = this;
    //Array for storing all of the requisitions
    vm.reqList = [];
    //Array for storing the events to be displayed in the calendar
    vm.events = [];
    //Calls our requisition service to populate the requisitions list, and also turn those into viewable events
    requisitionService.getAllRequisitions().then(function(resp){
        vm.reqList=resp;
        for(var i = 0; i < $scope.reqList.length; i++){
            var trainerId = $scope.reqList[i].reqHost;
            var requisitionId = $scope.reqList[i].reqRecruiter;
            var guestId = $scope.reqList[i].reqGuest;
            $scope.reqList[i].reqHost = globalVarService.getTrainerById(trainerId);
            $scope.reqList[i].reqRecruiter = globalVarService.getRecruiterById(requisitionId);
            $scope.reqList[i].reqGuest = globalVarService.getGuestById(guestId);
        }
        convertReqToEvents();
    });

    var convertReqToEvents = function(){
        for(i=0;i<vm.reqList.length;i++) {
            var curr = vm.reqList[i];
            vm.events.push({
                title: curr.reqHost.name + " is interviewing " + curr.reqGuest.firstName + ' ' + curr.reqGuest.lastName,
                color: { // can also be calendarConfig.colorTypes.warning for shortcuts to the deprecated event types
                    primary: '#ffa500', // the primary event color (should be darker than secondary)
                    secondary: '#ffeeaa' // the secondary event color (should be lighter than primary)
                },
                startsAt: moment(curr.interviewDate).toDate(),
                endsAt: moment(curr.interviewDate).add(30, 'minutes').toDate(),
                draggable: false,
                resizable: false,
                actions: actions
            });
        }
    };
    //These variables MUST be set as a minimum for the calendar to work
    vm.calendarView = 'month';
    vm.viewDate = new Date();
    var actions = [
        // {
    //   label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
    //   onClick: function(args) {
    //     console.log('Edited ' + args.calendarEvent);
    //   }
    // }, {
    //   label: '<i class=\'glyphicon glyphicon-remove\'></i>',
    //   onClick: function(args) {
    //     console.log('Deleted '+ args.calendarEvent);
    //   }
    // }
    ];


    vm.cellIsOpen = true;

    vm.addEvent = function() {
      vm.events.push({
        title: 'New event',
        startsAt: moment().startOf('day').toDate(),
        endsAt: moment().endOf('day').toDate(),
        color: calendarConfig.colorTypes.important,
        draggable: true,
        resizable: true
      });
    };

    vm.eventClicked = function(event) {
      console.log('Clicked ' + event);
    };

    vm.eventEdited = function(event) {
      console.log('Edited ' + event);
    };

    vm.eventDeleted = function(event) {
      console.log('Deleted '+ event);
    };

    vm.eventTimesChanged = function(event) {
      console.log('Dropped or resized '+ event);
    };

    vm.toggle = function($event, field, event) {
      $event.preventDefault();
      $event.stopPropagation();
      event[field] = !event[field];
    };

    vm.timespanClicked = function(date, cell) {

      if (vm.calendarView === 'month') {
        if ((vm.cellIsOpen && moment(date).startOf('day').isSame(moment(vm.viewDate).startOf('day'))) || cell.events.length === 0 || !cell.inMonth) {
          vm.cellIsOpen = false;
        } else {
          vm.cellIsOpen = true;
          vm.viewDate = date;
        }
      } else if (vm.calendarView === 'year') {
        if ((vm.cellIsOpen && moment(date).startOf('month').isSame(moment(vm.viewDate).startOf('month'))) || cell.events.length === 0) {
          vm.cellIsOpen = false;
        } else {
          vm.cellIsOpen = true;
          vm.viewDate = date;
        }
      }

    };

  });