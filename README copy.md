## A FAIRE

- Formaulaire de login
- Interface details Proprietaire
- Mise en place des autres formulaire pour la gestion proprietaire
- Mise en place locataire








# NgAblePro

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).




const country = 'France'; // Pays spécifié
fetch(`http://api.geonames.org/searchJSON?country=${country}&maxRows=10&username=kakashi_hatake`)
    .then(response => response.json())
    .then(data => {
    const cities = data.geonames; // Récupération de la liste des villes
    // Boucle sur les villes et affichage des noms
    cities.forEach(city => {
        console.log(city.name);
    });
    })
    .catch(error => {
    console.error('Une erreur s\'est produite lors de la recherche des villes :', error);
    });
