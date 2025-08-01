# TODOS / NOTES

TODO:

BEFORE

allDay: false
categoryId: 3
client: "Ron Zertnert"
end: Fri Aug 01 2025 01:00:00 GMT+1200 (New Zealand Standard Time)
notes: "ss"
start: Fri Aug 01 2025 00:00:00 GMT+1200 (New Zealand Standard Time)
_id: 4983

AFTER: 

id: 4983
clientId: 2 // use this to get client deets - JOIN!!!!
startTime: Fri Aug 01 2025 01:00:00 GMT+1200 (New Zealand Standard Time)
endTime: Fri Aug 01 2025 00:00:00 GMT+1200 (New Zealand Standard Time)
appointmentType: "ACC
notes: "normal note"


- When deleting a category that has appointments associated to it, it makes the appointment default go to another existing category. We need to handle this possibility. Give it a default category. 
Do we even need that functionality? 

- Think of where to deploy database - Railway??? 

- Make index tables. 

RESEARCH: 

How the heck do we test a postgres database??? Is it in memory? lolll 

STACK / TECH DECISIONS: 

- NO REACT ROUTER -FUCK THAT
- YES to Electron babyyyy

NOTICINGS: 

There could be a need to have the clients table notes field be it's own table too. For instacne if the user wants to add more notes to the main client info page as they go, not treatment notes, this new table would give the possibility to date any additional notes. 