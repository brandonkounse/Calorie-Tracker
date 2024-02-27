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
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    this._protein += meal.protein === undefined ? 0 : meal.protein;
    this._fat += meal.fat === undefined ? 0 : meal.fat;
    this._carbohydrate +=
      meal.carbo_carbohydrate === undefined ? 0 : meal.carbo_carbohydrate;
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
  }
}

class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).split('.')[1];
    this.name = name;
    this.calories = calories;
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
