# How to deal with time in this app: 

Resources: 
[Database Timestamps and Timezones](https://www.tinybird.co/blog-posts/database-timestamps-timezones)

Having all database timestamps in UTC is generally considered a best practice. 

Here's why:

Timezone independence: UTC is not subject to daylight saving time (DST) changes or other timezone-specific adjustments, making it a consistent and reliable choice.
Easier date/time calculations: When all timestamps are in UTC, you can perform date/time calculations without worrying about timezone conversions.
Simplified data aggregation and analysis: UTC timestamps make it easier to aggregate and analyze data across different regions and timezones.
Reduced errors: Using UTC timestamps reduces the risk of errors caused by timezone conversions or misunderstandings.

Because our postgres servers could be stored in a range of timezones once they are deployed, it's best for us to ensure that all our timestamps are changed to UTC in our server side when they are generated (in the migrations / seeds)and when they are being added to the database. This is best for a couple of reasons:

- Consistency: All timestamps stored in UTC regardless of server location
- Portability: If you move servers or work with distributed systems
- Best practice: Most applications store timestamps in UTC internally
- No server changes needed: Works with your current Auckland timezone setting

NOTE: Apparently postgres automatically converts utc into the database servers timestamp when you query data. 
For example:

  -- This stores the timestamp in UTC, but PostgreSQL remembers it as timestamptz
  INSERT INTO clients (first_name, last_name) VALUES ('John', 'Doe');
  -- created_at gets stored as something like '2025-08-12 10:30:00+00' (UTC)
  When you query data:
  sql-- Your Node.js client connects with timezone 'Pacific/Auckland'
  SELECT created_at FROM clients WHERE id = 1;
  -- Returns: 2025-08-12 23:30:00+13 (converted to Auckland time)

  -- If a client connected with timezone 'America/New_York'
  SELECT created_at FROM clients WHERE id = 1;
  -- Returns: 2025-08-12 06:30:00-04 (converted to New York time)

Because our server is currently in Pacific/Auckland, i am setting the pool to UTC in the `server/database/connection.ts` file.

This way every connection starts with UTC timezone, and all the conversion code can happen client side. 

NOTE: when you use pgAdmin, you should run this SQL command: 

SHOW timezone;

if it says Pacific/Auckland that means your data will display in that server timezone, but don't worry, your api requestss will show the actual utc value. 
You can change your pgAdmin settings to be UTC for a session, but it's not longterm, and any bigger changes will be more to do with your computer settings, so don't worry about that. 

# When we want to convert to UTC on the server side? 


Server-side conversion is preferred when you add data to the database, for a few reasons:

1. Single source of truth

All timezone logic lives in one place (your API)
Easier to maintain and debug
Consistent behavior across all clients

2. Security and validation

Server can validate timezone data before storing
Client can't send malformed or malicious timezone data
You control the conversion logic completely

3. Client simplicity

Clients just send timestamps in their local timezone
No need for clients to understand your database timezone preferences
Works with any client (web, mobile, third-party integrations)

4. Flexibility

Easy to change timezone handling logic later
Can add timezone validation/sanitization
Can handle different client timezone formats consistently


**The general rule:** 
- clients send local time, 
- server converts and stores in UTC, 
- server returns UTC to clients.
- client converts and display in local timezone.
    - 1. User's actual timezone

      Browser knows the user's real timezone automatically
      Server doesn't know where the user actually is
      Users might be traveling or in different timezones than expected

    - 2. Performance

      No need to send timezone info back and forth
      Server doesn't need to do conversion calculations for every request
      Client can cache and reuse timezone logic

    - 3. User experience

      Times automatically appear in user's local time
      Works correctly even if user changes timezones
      No server round-trip needed for timezone changes

## Routes: 

Appointments: 

the POST and PATCH routes use the client's local time in the req.body: 

{
    "clientId": 4,
    "startTime": "2025-08-12T09:00:00+13:00",  // Auckland time
    "endTime": "2025-08-12T10:00:00+13:00", // Auckland time
    "appointmentType": "Edited",
    "notes": "Patched appointment"
  }

  and it converts it to UTC before adding to database. 