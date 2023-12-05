document.addEventListener('DOMContentLoaded', function () {
  const lifts = {
    lift1: { id: 1, currentFloor: 0, busy: false, direction: 0 },
    lift2: { id: 2, currentFloor: 0, busy: false, direction: 0 },
    lift3: { id: 3, currentFloor: 0, busy: false, direction: 0 },
    lift4: { id: 4, currentFloor: 0, busy: false, direction: 0 }
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
    const destination = floor * floorHeight;
    const initialPosition = lift.currentFloor * floorHeight;
    const startTime = performance.now();
    const duration = Math.abs(lift.currentFloor - floor) * 500; // Adjust the duration as needed
     function animate() {
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentPosition = initialPosition + (destination - initialPosition) * progress;
       liftElements[`lift${lift.id}`].style.bottom = `${currentPosition}px`;
       if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        lift.currentFloor = floor;
        console.log(`Lift ${lift.id} arrived at floor ${floor}`);
        setTimeout(() => {
          lift.busy = false;
          processNextRequest(lift.id);
        }, 3000); // Stop for 3 seconds at the destination
      }
    }
     animate();
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
      const lift = lifts[`lift${nearestLift}`];
      const currentRequest = requestsQueue[nearestLift];
       if (currentRequest && currentRequest.length > 0) {
        const lastFloorInRequest = currentRequest[currentRequest.length - 1];
         if (floor > lift.currentFloor) {
          lift.direction = 1; // Set direction to up
        } else if (floor < lift.currentFloor) {
          lift.direction = -1; // Set direction to down
        }
         // Check if the new request is in the same direction
        if ((floor > lift.currentFloor && lift.direction === 1) ||
            (floor < lift.currentFloor && lift.direction === -1)) {
          // If yes, add the intermediate floor
          currentRequest.push(floor);
          processNextRequest(nearestLift);
        } else if (lastFloorInRequest !== floor) {
          // If the new request is in the opposite direction, create a new request
          requestsQueue[nearestLift] = requestsQueue[nearestLift] || [];
          requestsQueue[nearestLift].push(parseInt(floor));
          processNextRequest(nearestLift);
        }
      } else {
        // If there is no existing request, create a new request
        requestsQueue[nearestLift] = requestsQueue[nearestLift] || [];
        requestsQueue[nearestLift].push(parseInt(floor));
        processNextRequest(nearestLift);
      }
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
    dropdown.addEventListener('change', function () {
      const selectedFloor = this.value;
      prioritizeLift(parseInt(this.dataset.floor), parseInt(selectedFloor));
    });
  });
 });
 
 
 
 
 
 
