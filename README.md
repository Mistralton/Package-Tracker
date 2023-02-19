# Package Tracker

![home page](public/image.png)

[Click here](https://pack-track.vercel.app/) to view the deployment.

Package Tracker is a web-based application that allows users to track their packages from different shipping companies in one place.

## Inspiration

The inspiration for Package Tracker came from the frustration of having to navigate through multiple shipping company websites to track packages. We wanted to create a centralized platform for package tracking that is both user-friendly and efficient.

## What it does

Users can enter their package tracking number into the application and view real-time updates on the status of their packages, including delivery times, locations, and tracking history. The app also provides a mapping feature to show where the package is at any given moment. Additionally, users can rate shipping companies and provide feedback on their experiences. The application utilizes a cloud-based Firebase function that runs every hour to update package status.

## How we built it

We scraped the shipping tracking page for USPS and integrated it with Next.js for rendering the data. Firebase was used to store the data, and Mapbox was used to create the mapping feature. Authentication was added using Auth0.

## Challenges we ran into

One of the main challenges we faced was finding an idea that was both feasible within the time constraints of the hackathon and applicable to everyday consumers. We also encountered difficulties integrating with FedEx and UPS due to the nature of their APIs, and the project currently only supports USPS.

## Accomplishments that we're proud of

We are proud of the fact that we were able to create a functional and user-friendly application using frameworks and tools that we were not previously experienced with.
What we learned
Through the development of Package Tracker, we gained experience in using authentication services such as Auth0 and implementing cloud-based functions and schedulers with Firebase.

## What's next for Package Tracker

Moving forward, we hope to expand the application to support more shipping companies and add features such as notifications for package updates.

## Getting Started

To use Package Tracker, simply visit the website and enter your package tracking number (USPS).

## Technologies Used

Next.js
Firebase
Mapbox
Auth0
