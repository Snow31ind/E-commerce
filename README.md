# TechNerds - web-based application 

## Table of Contents
* [Introduction](#introduction)
* [Project aim](#project-aim)
* [Technologies](#technologies)
* [Features](#features)
* [Web visualization](#web-visualization)
* [Demo video](#demo-video)
* [Setup](#setup)

## Introduction
An E-commerce web-based application implemented using framework NextJS, Material UI, MongoDB, and other helpful utilities.

## Project aim
* Provide an ecommerce gateway for shops that sell electronic devices, particularly laptops.

## Technologies
* Front-end: Next JS, Material UI (MUI)
* Back-end: Next JS
* NoSQL Database: MongoDB

## Features
* Responsive UI.
* Integration of Paypal payment.
* Admin dashboard.
* Cookies stored on browser.

## Web visualization
1. Homepage:
![Hero banner](https://user-images.githubusercontent.com/90770150/167164880-54ecd293-1521-47b0-950a-a04fc1046053.png))
![Products & filter](https://user-images.githubusercontent.com/90770150/167165120-0d528f12-6564-4f83-b9f7-4a6666ee8543.png)

2. Admin dashboard:
![Dashboard](https://user-images.githubusercontent.com/90770150/167165233-083cd495-2bb0-4758-bed8-761c45e42271.png)

3. And more
* Available in the following demo video!

## Demo video
[Video](https://drive.google.com/file/d/1l5P9tsBH6lM4LXGCBzIX6XziRJ7U1XSE/view?usp=sharing)

## Setup
1. Run `npm install` on the project's root terminal
- Install necessary packages

2. Local environment variables configurations
* Create a file `.env`
* Add all following environment variables.

| Variable | Value |
| --- | --- |
| MONGODB_URI | `your MONGODB_URI` (provided on your MongoDB cluster) |
| JWT_SECRET | `your JWT_SECRET` (a unique string to you!) |
| PAYPAL_CLIENT_ID | `your PAYPAL_CLIENT_ID` (A unique ID for Paypal integration provided by Paypal) |


3. Run `npm run dev`
- Run the app in the development mode.
- Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
