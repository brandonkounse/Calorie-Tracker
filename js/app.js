class CalorieTracker {
  constructor() {
    this._calorieLimit = 2000;
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    this._protein = 0;
    this._fat = 0;
    this._carbohydrate = 0;
  }

  addMeal(meal) {
    if (meal instanceof Meal) {
      this._meals.push(meal);
      this._totalCalories += meal.calories;
      this._protein += meal.protein ?? 0;
      this._fat += meal.fat ?? 0;
      this._carbohydrate += meal.carbohydrate ?? 0;
    } else {
      console.log('invalid meal');
    }
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
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

const tracker = new CalorieTracker();
const breakfast = new Meal('breakfast', 400);
