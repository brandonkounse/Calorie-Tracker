class CalorieTracker {
  constructor() {
    this._calorieLimit = 2000;
    this._calorieBalance = 0;
    this._caloriesConsumed = 0;
    this._caloriesBurned = 0;
    this._caloriesRemaining = this._calorieLimit;
    this._meals = [];
    this._workouts = [];
    this._totalProtein = 0;
    this._totalFat = 0;
    this._totalCarbohydrate = 0;

    this._render();
  }

  addMeal(meal) {
    if (meal instanceof Meal) {
      this._meals.push(meal);
      this._caloriesConsumed += meal.calories;
      this._totalProtein += meal.protein ?? 0;
      this._totalFat += meal.fat ?? 0;
      this._totalCarbohydrate += meal.carbohydrate ?? 0;
    } else {
      console.log('invalid meal');
    }
    this._calculateCaloriesConsumedAndBurned();
    this._displayNewMeal(meal);
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._caloriesBurned += workout.calories;
    this._calculateCaloriesConsumedAndBurned();
    this._displayNewWorkout(workout);
    this._render();
  }

  // Private Methods
  _displayCalorieLimit() {
    const calLimitElement = document.querySelector('#calories-limit');
    calLimitElement.innerHTML = this._calorieLimit;
  }

  _displayCalorieBalance() {
    const calTotalElement = document.querySelector('#calorie-balance');
    calTotalElement.innerHTML = this._calorieBalance;
  }

  _displayCaloriesConsumed() {
    const calConsumedElement = document.querySelector('#calories-consumed');
    calConsumedElement.innerHTML = this._caloriesConsumed;
  }

  _displayCaloriesBurned() {
    const calBurnedElement = document.querySelector('#calories-burned');
    calBurnedElement.innerHTML = this._caloriesBurned;
  }

  _displayCaloriesRemaining() {
    const calRemainingElement = document.querySelector('#calories-remaining');
    const progressElement = document.querySelector('#calorie-progress');

    calRemainingElement.innerHTML = this._caloriesRemaining;

    if (this._caloriesRemaining <= 0) {
      calRemainingElement.parentElement.parentElement.classList.remove(
        'bg-light'
      );
      calRemainingElement.parentElement.parentElement.classList.add(
        'bg-danger'
      );
      progressElement.classList.remove('bg-success');
      progressElement.classList.add('bg-danger');
    } else {
      calRemainingElement.parentElement.parentElement.classList.add('bg-light');
      calRemainingElement.parentElement.parentElement.classList.remove(
        'bg-danger'
      );
      progressElement.classList.add('bg-success');
      progressElement.classList.remove('bg-danger');
    }
  }

  _displayTotalProtein() {
    const proteinElement = document.querySelector('#protein');
    proteinElement.innerHTML = this._totalProtein;
  }

  _displayTotalFat() {
    const fatElement = document.querySelector('#fat');
    fatElement.innerHTML = this._totalFat;
  }

  _displayTotalCarbohydrate() {
    const carbohydrateElement = document.querySelector('#carbohydrate');
    carbohydrateElement.innerHTML = this._totalCarbohydrate;
  }

  _calculateCaloriesConsumedAndBurned() {
    this._calorieBalance = this._caloriesConsumed - this._caloriesBurned;
    this._caloriesRemaining =
      this._calorieLimit - (this._caloriesConsumed - this._caloriesBurned);
  }

  _displayCalorieProgress() {
    const progressElement = document.querySelector('#calorie-progress');
    const percentage = (this._calorieBalance / this._calorieLimit) * 100;
    const width = Math.min(percentage, 100);
    progressElement.style.width = `${width}%`;
  }

  _displayNewMeal(meal) {
    const mealsElement = document.querySelector('#meal-items');
    const mealElement = document.createElement('div');
    mealElement.classList.add('card', 'my-2');
    mealElement.setAttribute('data-id', meal.id);
    mealElement.innerHTML = `
      <div class="card-body">
      <div class="d-flex align-items-center justify-content-between">
        <h4 class="mx-1">${meal.name}</h4>
        <div
          class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
        >
          ${meal.calories}
        </div>
        <button class="delete btn btn-danger btn-sm mx-2">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
    `;
    mealsElement.appendChild(mealElement);
  }

  _displayNewWorkout(workout) {
    const workoutsElement = document.querySelector('#workout-items');
    const workoutElement = document.createElement('div');
    workoutElement.classList.add('card', 'my-2');
    workoutElement.setAttribute('data-id', workout.id);
    workoutElement.innerHTML = `
      <div class="card-body">
      <div class="d-flex align-items-center justify-content-between">
        <h4 class="mx-1">${workout.name}</h4>
        <div
          class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
        >
          ${workout.calories}
        </div>
        <button class="delete btn btn-danger btn-sm mx-2">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
    `;
    workoutsElement.appendChild(workoutElement);
  }

  _render() {
    this._displayCalorieBalance();
    this._displayCalorieLimit();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayTotalProtein();
    this._displayTotalFat();
    this._displayTotalCarbohydrate();
    this._displayCalorieProgress();
  }
}

class Meal {
  constructor(name, calories, macros = {}) {
    this.id = Math.random().toString(16).split('.')[1];
    this.name = name;
    this.calories = calories;
    this.protein = macros['protein'];
    this.fat = macros['fat'];
    this.carbohydrate = macros['carbohydrate'];
  }
}

class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).split('.')[1];
    this.name = name;
    this.calories = calories;
  }
}

class App {
  constructor() {
    this._tracker = new CalorieTracker();

    document
      .querySelector('#meal-form')
      .addEventListener('submit', this._newItem.bind(this, 'meal'));

    document
      .querySelector('#workout-form')
      .addEventListener('submit', this._newItem.bind(this, 'workout'));
  }

  _newItem(type, e) {
    e.preventDefault();

    const name = document.querySelector(`#${type}-name`);
    const calories = document.querySelector(`#${type}-calories`);

    // Validate Inputs
    if (name.value === '' || calories.value === '') {
      alert('Please fill in name and calorie fields');
      return;
    }

    // Add meal or workout
    if (type === 'meal') {
      const protein = document.querySelector('#protein-total');
      const fat = document.querySelector('#fat-total');
      const carbohydrate = document.querySelector('#carbohydrate-total');

      const meal = new Meal(name.value, parseInt(calories.value), {
        protein: protein.value ? parseInt(protein.value) : 0,
        fat: fat.value ? parseInt(fat.value) : 0,
        carbohydrate: carbohydrate.value ? parseInt(carbohydrate.value) : 0,
      });
      this._tracker.addMeal(meal);

      // Clear values
      protein.value = '';
      fat.value = '';
      carbohydrate.value = '';
    } else {
      const workout = new Workout(name.value, parseInt(calories.value));
      this._tracker.addWorkout(workout);
    }

    // Clear form
    name.value = '';
    calories.value = '';

    const collapseItem = document.querySelector(`#collapse-${type}`);
    const bsCollapse = new bootstrap.Collapse(collapseItem, {
      toggle: true,
    });
  }
}

const app = new App();
