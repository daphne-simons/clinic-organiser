# USER STORIES

## Appointments Feature 

As a user, I want to be able to see my upcoming week schedule, Monday to Sunday for that current week, and to be able to switch between week views (past and future).

As a user I want to be able to make a new appointment by double clicking on a day/ time. This should open up a window with options to fill out, including client name, time slots etc. For the client name option, it should be a dynamic search bar as the user types in a name. If that client already exists, the user should be able to select them so it connects to their data. If this client is new, doesn’t exist in the database yet, give the option to create a new client within the same modal.

When the user clicks on an existing appointment, it should give a clear link to open up a new treatment record. Perhaps with a “Go To Treatment” button as an option. The user can then fill it in as they go, adding notes during/ after the appointment. Find a way to auto-save this form content, so it doesn’t get lost on refresh/ app close. 

When the user clicks on an existing appointment, the client name should link to the clients information page that shows their contact details. Just in case the user has to contact them, or alter their information somehow. 

In general, the user should be able to drag and drop the appointment block to other times and days of the calendar. Would be cool to be able to adapt the appointment length by expanding the beginning or end of the appointment. (see Toggle for ux example) 

STRETCH: On the left hand side of the appointments page, next to the week view, include a 3 month overview. Show the current month first, and the next two months. When the user clicks one of those months, it should show the first week of that selected month on the week view. STRETCH: have some arrows underneath the 3 months, so that a user can skip forward or backwards 3 months at a time. 

## Clients Feature

When the clients tab is selected, the user should see a list of all their clients in alphabetical order by first name. 

There should be a search bar at the top, that allows the user to type in their clients name, and the results underneath should change dynamically in response to each keystroke. 

There should be an option to "Add a New Client”. When the user clicks this, they should see a series of sub menu tabs, that include; Client Details, Medical Hx, TCM (stands for traditional chinese medicine), Treatments (where the clients treatment history will be listed), Communications, and Attachments. 

Initially this Client profile section will start/ land on the “Client Details” page, where the user can fill in the Client Details, when they add something into an input, it should automatically save. Maybe for MVP, we have a save button. Stretch, auto-save. 

Medical Hx section: see wirefrAme and ERD for what to include in that form. Note, all of the tick boxes / info should be visible, no drop downs or hidden content. 

TCM section: see wirefrAme and ERD for what to include in that form. Note, all of the tick boxes / info should be visible, no drop downs or hidden content. 

Treatment section: Should initially display a list of previous treatments (a treatment history), but if there are no treatments yet, that’s fine, it should just show a clear “Create new Treatment” button so the user can add a new one. Once they’ve clicked that, they should see a form to fill out. See wirefrAme and ERD for what to include in that form. Note, all of the tick boxes / info should be visible, no drop downs or hidden content.

Treatment section - Create New Treatment. 
As a user, one of the features of this create new treatment section is a place to upload a ‘drawing’ of the treatment. See cliniko for an example of UI. Essentially, it opens up a canvas module, where you can either select some existing body maps/ diagrams (previously uploaded), that the user can then draw on top of, showing the areas where the client got treatment. OR, it could be a blank canvas. There should also be a place for the user to be able to upload a new image (body map, diagram, whatevs). 


Treatment section - Create New Treatment. 
Use Multer to make the image upload feature functional. Keeping performance in mind - find a way to compress the image size, and maybe even change it to webp or png format, before it’s stored in the database. This will help with long term speed / storage capability of the database. 

Communications feature. A place to see communications history with client. To create a new communications record, have a “Create new Communications Record” button, when clicked, have a simple form that includes; Communication type dropdown with, sms, email and call, as the options, and a place for the user to write or copy paste the comms content. Save this. 

Attachments Feature, a place for the user to store and view any additional info for the client in a multi-media format. This could include doctors records, photographs, x-rays, diagnostic reports etc. And should include a variety of file types, including, pdf, jpg, png, excel, cms, word.docx, text field, whatever really. STRETCH, like for the drawing feature of the Treatment section; find a way to compress the image size, and maybe even change it to webp or png format, before it’s stored in the database. This will help with long term speed / storage capability of the database. 


## Customisable forms: 

A user should be able to customise their data. 
E.g. to be able to customise what fields and data types go in their treatment records. This customisability is actually a big appeal for these clinic apps, especially for private practitioners, who need to be able to customise what they include in their treatments and records. It's really not a 'one size fits all' situation.


STRETCH: Give a user the possibility to choose different styles/ templates of the app, e.g. Acupuncture Clinic Management, Physiotherapy Clinic Management, Vet Clinic Management, etc/ other non-gp medical practitioners.