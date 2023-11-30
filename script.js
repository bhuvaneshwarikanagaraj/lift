document.addEventListener('DOMContentLoaded', function() {
  const lifts = {
    lift1: {
      id: 1,
      currentFloor: 0,
      busy: false,
      direction: 0
    },
    lift2: {
      id: 2,
      currentFloor: 0,
      busy: false,
      direction: 0
    },
    lift3: {
      id: 3,
      currentFloor: 0,
      busy: false,
      direction: 0
    },
    lift4: {
      id: 4,
      currentFloor: 0,
      busy: false,
      direction: 0
    }
  };

  const liftElements = {
    lift1: document.getElementById('lift1'),
    lift2: document.getElementById('lift2'),
    lift3: document.getElementById('lift3'),
    lift4: document.getElementById('lift4')
  };

  const floorHeight = 73;
  const requestsQueue = {};

  function moveLift(lift, floor) {
    lift.busy = true;
    const distance = Math.abs(lift.currentFloor - floor) * floorHeight;
    const destination = floor * floorHeight;

    liftElements[`lift${lift.id}`].style.bottom = `${destination}px`;

    setTimeout(() => {
      lift.currentFloor = floor;
      lift.busy = false;
      console.log(`Lift ${lift.id} arrived at floor ${floor}`);
      processNextRequest(lift.id);
    }, distance * 0.5);
  }

  function processNextRequest(liftId) {
    if (requestsQueue[liftId] && requestsQueue[liftId].length > 0) {
      const floor = requestsQueue[liftId].shift();
      moveLift(lifts[`lift${liftId}`], floor);
    } else {
      lifts[`lift${liftId}`].direction = 0;
    }
  }

  function requestLift(floor) {
    let minDistance = Number.MAX_VALUE;
    let nearestLift = null;

    Object.values(lifts).forEach(lift => {
      const distance = Math.abs(lift.currentFloor - floor);
      if (distance < minDistance && !lift.busy) {
        minDistance = distance;
        nearestLift = lift.id;
      }
    });

    if (nearestLift !== null) {
      requestsQueue[nearestLift] = requestsQueue[nearestLift] || [];
      requestsQueue[nearestLift].push(parseInt(floor));
      processNextRequest(nearestLift);
    } else {
      console.log('All lifts are busy.');
    }
  }

  function prioritizeLift(userFloor, destinationFloor) {
    let minDistance = Number.MAX_VALUE;
    let nearestLift = null;

    Object.values(lifts).forEach(lift => {
      const distance = Math.abs(lift.currentFloor - userFloor) + Math.abs(userFloor - destinationFloor);
      if (distance < minDistance && !lift.busy) {
        minDistance = distance;
        nearestLift = lift.id;
      }
    });

    if (nearestLift !== null) {
      requestsQueue[nearestLift] = requestsQueue[nearestLift] || [];
      requestsQueue[nearestLift].push(parseInt(userFloor));
      requestsQueue[nearestLift].push(parseInt(destinationFloor));
      processNextRequest(nearestLift);
    } else {
      console.log('All lifts are busy.');
    }
  }

  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener('change', function() {
      const selectedFloor = this.value;
      prioritizeLift(parseInt(this.dataset.floor), parseInt(selectedFloor));
    });
  });
});
