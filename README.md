# [GameOfThrones-D3]

GameOfThrones-D3 explores the interactions between the various characters of HBO series **Game of Thrones** through several D3.js visualization techniques.

![screenshot](https://user-images.githubusercontent.com/13773733/58668814-21b50800-8308-11e9-95a4-f910b607996f.png)
![screenshot2](https://user-images.githubusercontent.com/13773733/58668625-75732180-8307-11e9-8588-73e160b4e9b4.jpg)

## Background

This application uses data solely based on the HBO series, fan-based datasets which can be found here: 
* [collection 1](https://data.world/aendrew/game-of-thrones-deaths)
* [collection 2](https://github.com/mathbeveridge/gameofthrones)

Characters informations are based on HBO's series [viewers guide](http://viewers-guide.hbo.com/game-of-thrones/).

This application incorporates several of representation of those data, outlined below in the **Functionality & MVP** section.

## Functionality & MVP

With GameOfThrones-D3, users will be able to:
- [x] View the interactions between each of the series' characters through a Force Layout
* - [x] Selecting the dataset displayed, corresponding to data from seasons 1 through 7
* - [x] Manipulate the nodes by clicking and draging each nodes around the layout screen
* - [x] Switching between displaying names-links or nodes-links
* - [x] Zoom in and out while interacting with the force layout
* - [x] Pan up, down, left, and right while interacting with the force layout

- [x] View the interactions between each of the series' characters through a 2-D Matrix representation,
based on cumulative data from seasons 1 through 7
* - [x] Select whether to reorganize the characters by name or by frequency of interactions

- [x] View the number of deaths associated to main characters through a Bar Chart representation
* - [x] Show or hide the Bar Chart

## Installation

```
git clone https://github.com/valery-nguyen/GameOfThrones-D3.git
cd GameOfThrones-D3
npm install
cd frontend
npm install
```

## Run

* Start the server and client concurrently

```
npm run dev
```

### Deployment
* Hosted on [Heroku](https://www.heroku.com/)

### Built With
* [D3.js v5](https://d3js.org/)
* [React.js](https://reactjs.org)
* [Redux.js](https://redux.js.org)
* [Express.js](https://expressjs.com/)
* [Node.js](https://nodejs.org/)

## Authors
* **Valery Nguyen**

[//]: # (reference links are listed below)
[GameOfThrones-D3]: <https://gameofthrones-d3.herokuapp.com/>
