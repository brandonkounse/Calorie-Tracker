class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._calorieBalance = Storage.getTotalCalories();
    this._caloriesConsumed = Storage.getCaloriesConsumed();
    this._caloriesBurned = Storage.getCaloriesBurned();
    this._caloriesRemaining = this._calorieLimit - this._calorieBalance;
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();
    this._totalProtein = Storage.getProtein();
    this._totalFat = Storage.getFat();
    this._totalCarbohydrate = Storage.getCarbohydrate();

    this._render();
  }

  addMeal(meal) {
    if (meal instanceof Meal) {
      Storage.saveMeal(meal);
      this._caloriesConsumed += meal.calories;
      Storage.updateCaloriesConsumed(this._caloriesConsumed);
      this._totalProtein += meal.protein ?? 0;
      this._totalFat += meal.fat ?? 0;
      this._totalCarbohydrate += meal.carbohydrate ?? 0;
      Storage.saveMacros(
        this._totalProtein,
        this._totalFat,
        this._totalCarbohydrate
      );
    } else {
      console.log('invalid meal');
    }
    this._calculateCaloriesConsumedAndBurned();
    this._displayNewMeal(meal);
    this._render();
  }

  addWorkout(workout) {
    Storage.saveWorkout(workout);
    this._caloriesBurned += workout.calories;
    Storage.updateCaloriesBurned(this._caloriesBurned);
    this._calculateCaloriesConsumedAndBurned();
    this._displayNewWorkout(workout);
    this._render();
  }

  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id);

    if (index !== -1) {
      const meal = this._meals[index];
      this._caloriesConsumed -= meal.calories;
      this._totalProtein -= meal.protein;
      this._totalFat -= meal.fat;
      this._totalCarbohydrate -= meal.carbohydrate;
      this._calculateCaloriesConsumedAndBurned();
      this._meals.splice(index, 1);
      Storage.removeMeal(id);
      this._render();
    }
  }

  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);

    if (index !== -1) {
      const workout = this._workouts[index];
      this._caloriesBurned -= workout.calories;
      this._calculateCaloriesConsumedAndBurned();
      this._workouts.splice(index, 1);
      Storage.removeWorkout(id);
      this._render();
    }
  }

  reset() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._calorieBalance = Storage.getTotalCalories();
    this._caloriesConsumed = Storage.getCaloriesConsumed();
    this._caloriesBurned = Storage.getCaloriesBurned();
    this._caloriesRemaining = this._calorieLimit - this._calorieBalance;
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();
    this._totalProtein = Storage.getProtein();
    this._totalFat = Storage.getFat();
    this._totalCarbohydrate = Storage.getCarbohydrate();
    Storage.clearAll();

    this._render();
  }

  setLimit(calorieLimit) {
    this._calorieLimit = calorieLimit;
    Storage.setCalorieLimit(calorieLimit);
    this._render();
  }

  loadItems() {
    this._meals.forEach((meal) => this._displayNewMeal(meal));
    this._workouts.forEach((workout) => this._displayNewWorkout(workout));
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

class Storage {
  static getCalorieLimit(defaultLimit = 2000) {
    let calorieLimit;
    if (localStorage.getItem('calorieLimit') === null) {
      calorieLimit = defaultLimit;
    } else {
      calorieLimit = parseInt(localStorage.getItem('calorieLimit'));
    }
    return calorieLimit;
  }

  static setCalorieLimit(calorieLimit) {
    localStorage.setItem('calorieLimit', calorieLimit);
  }

  static getTotalCalories(defaultCalories = 0) {
    return this.getCaloriesConsumed() - this.getCaloriesBurned();
  }

  static getCaloriesConsumed(defaultCalories = 0) {
    let caloriesConsumed;
    if (localStorage.getItem('caloriesConsumed') === null) {
      caloriesConsumed = defaultCalories;
    } else {
      caloriesConsumed = parseInt(localStorage.getItem('caloriesConsumed'));
    }
    return caloriesConsumed;
  }

  static getCaloriesBurned(defaultCalories = 0) {
    let caloriesBurned;
    if (localStorage.getItem('caloriesBurned') === null) {
      caloriesBurned = defaultCalories;
    } else {
      caloriesBurned = parseInt(localStorage.getItem('caloriesBurned'));
    }
    return caloriesBurned;
  }

  static updateCaloriesConsumed(calories) {
    localStorage.setItem('caloriesConsumed', calories);
  }

  static updateCaloriesBurned(calories) {
    localStorage.setItem('caloriesBurned', calories);
  }

  static getMeals() {
    let meals;
    if (localStorage.getItem('meals') === null) {
      meals = [];
    } else {
      meals = JSON.parse(localStorage.getItem('meals'));
    }
    return meals;
  }

  static saveMacros(protein, fat, carbohydrate) {
    localStorage.setItem('protein', protein);
    localStorage.setItem('fat', fat);
    localStorage.setItem('carbohydrate', carbohydrate);
  }

  static getProtein() {
    let protein;
    if (localStorage.getItem('protein') === null) {
      protein = 0;
    } else {
      protein = parseInt(localStorage.getItem('protein'));
    }
    return protein;
  }

  static getFat() {
    let fat;
    if (localStorage.getItem('fat') === null) {
      fat = 0;
    } else {
      fat = parseInt(localStorage.getItem('fat'));
    }
    return fat;
  }

  static getCarbohydrate() {
    let carbohydrate;
    if (localStorage.getItem('carbohydrate') === null) {
      carbohydrate = 0;
    } else {
      carbohydrate = parseInt(localStorage.getItem('carbohydrate'));
    }
    return carbohydrate;
  }

  static getWorkouts() {
    let workouts;
    if (localStorage.getItem('workouts') === null) {
      workouts = [];
    } else {
      workouts = JSON.parse(localStorage.getItem('workouts'));
    }
    return workouts;
  }

  static saveMeal(meal) {
    const meals = Storage.getMeals();
    meals.push(meal);
    localStorage.setItem('meals', JSON.stringify(meals));
  }

  static removeMeal(id) {
    const meals = Storage.getMeals();
    meals.forEach((meal, index) => {
      if (meal.id === id) {
        meals.splice(index, 1);
      }
    });
    localStorage.setItem('meals', JSON.stringify(meals));
  }

  static saveWorkout(meal) {
    const workouts = Storage.getWorkouts();
    workouts.push(meal);
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }

  static removeWorkout(id) {
    const workouts = Storage.getWorkouts();
    workouts.forEach((workout, index) => {
      if (workout.id === id) {
        workouts.splice(index, 1);
      }
    });
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }

  static clearAll() {
    localStorage.clear();
  }
}

class App {
  constructor() {
    this._tracker = new CalorieTracker();
    this._loadEventListeners();
    this._tracker.loadItems();
  }

  _loadEventListeners() {
    document
      .querySelector('#meal-form')
      .addEventListener('submit', this._newItem.bind(this, 'meal'));

    document
      .querySelector('#workout-form')
      .addEventListener('submit', this._newItem.bind(this, 'workout'));

    document
      .querySelector('#meal-items')
      .addEventListener('click', this._removeItem.bind(this, 'meal'));

    document
      .querySelector('#workout-items')
      .addEventListener('click', this._removeItem.bind(this, 'workout'));

    document
      .querySelector('#filter-meals')
      .addEventListener('keyup', this._filterItems.bind(this, 'meal'));

    document
      .querySelector('#filter-workouts')
      .addEventListener('keyup', this._filterItems.bind(this, 'workout'));

    document
      .querySelector('#reset')
      .addEventListener('click', this._reset.bind(this));

    document
      .querySelector('#limit-form')
      .addEventListener('submit', this._setLimit.bind(this));
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

  _removeItem(type, e) {
    if (
      e.target.classList.contains('delete') ||
      e.target.classList.contains('fa-xmark')
    ) {
      if (confirm('Are you sure?')) {
        const id = e.target.closest('.card').getAttribute('data-id');

        type === 'meal'
          ? this._tracker.removeMeal(id)
          : this._tracker.removeWorkout(id);

        e.target.closest('.card').remove();
      }
    }
  }

  _filterItems(type, e) {
    const text = e.target.value.toLowerCase();
    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      const name = item.firstElementChild.firstElementChild.textContent;

      if (name.toLowerCase().indexOf(text) !== -1) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  _reset() {
    if (confirm('Are you sure you want to clear all data?')) {
      this._tracker.reset();
      document.querySelector('#meal-items').innerHTML = '';
      document.querySelector('#workout-items').innerHTML = '';
      document.querySelector('#filter-meals').value = '';
      document.querySelector('#filter-workouts').value = '';
    }
  }

  _setLimit(e) {
    e.preventDefault();

    const limit = document.querySelector('#limit');

    if (limit.value === '') {
      alert('Please add a limit');
      return;
    }
    this._tracker.setLimit(parseInt(limit.value));
    limit.value = '';

    const modalElement = document.querySelector('#limit-modal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }
}

const app = new App();
