# Timezone learnings and strategy with this app

Resources: 
[Database Timestamps and Timezones](https://www.tinybird.co/blog-posts/database-timestamps-timezones)

Having all database timestamps in UTC is generally considered a best practice. 

A couple of key reasons include: 

- Timezone independence: UTC is not subject to daylight saving time (DST) changes or other timezone-specific adjustments, making it a consistent and reliable choice.
- Easier date/time calculations: When all timestamps are in UTC, you can perform date/time calculations without worrying about timezone conversions.
- Simplified data aggregation and analysis: UTC timestamps make it easier to aggregate and analyze data across different regions and timezones.
- Reduced errors: Using UTC timestamps reduces the risk of errors caused by timezone conversions or misunderstandings.

Once deployed, our postgreSQL databases could be stored in a range of timezones. The way to ensure we have consistent data no matter where these servers are storing the data, we want to make sure our timestamps are changed to UTC in our server side when they are generated (in the migrations / seeds) AND when they are being added to the database. 

NOTE: Apparently postgreSQL automatically converts utc into the database servers timestamp when you query data. 

For example:

```sql
  -- This stores the timestamp in UTC, but PostgreSQL remembers it as timestamptz
  INSERT INTO clients (first_name, last_name) VALUES ('John', 'Doe');
  
  -- `created_at` (a field made by default) gets stored as this format '2025-08-12 10:30:00+00' (UTC)
  -- And when you query the data, your Node.js client connects with timezone 'Pacific/Auckland'. So if i connected with timezone 'Pacific/Auckland'... 

  SELECT created_at FROM clients WHERE id = 1;
  -- would return: 2025-08-12 23:30:00+13 (converted to Auckland time)

  -- If a client connected with timezone 'America/New_York'... 
  SELECT created_at FROM clients WHERE id = 1;
  -- would return: 2025-08-12 06:30:00-04 (converted to New York time)
```

Because of this inconcistent behaviour, I have manually setting the pool to UTC in the `server/database/connection.ts` file.

This way every connection starts with a UTC timezone no matter where we spin up the app, and all the conversion code (changing it to localtime) can happen client side. 

NOTE: when you use pgAdmin, you should run this SQL command: 

```sql
SHOW timezone;
```

if it says 'Pacific/Auckland' that means your data will display in that server timezone, but don't worry, your api requestss will show the actual UTC value. 
You can change your pgAdmin settings to be UTC for a session, but it's not a long term solution, so just keep this behaviour in mind. 

# When do we want to convert local timezones to UTC? 

Server-side conversion from local to UTC is preferred. 
For example, when you add data to the database.

Pros of server-side conversion - local to UTC: 

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


## Timezone takeaways/ strategies: 

<!-- POST and PATCH -->
- clients send local time to the server, 
- server converts and stores in UTC, 

<!-- GETs -->
- server returns UTC to the client.
- client converts UTC to local timezone (in clientside apis).

# When do we want to convert UTC to local timezones? 

When we fetch timezone data from the backend, it will be in UTC format, we will convert these to local timezones for a couple of reasons:

    1. User's actual timezone

      Browser knows the user's real timezone automatically
      Server doesn't know where the user actually is
      Users might be traveling or in different timezones than expected

    2. Performance

      No need to send timezone info back and forth
      Server doesn't need to do conversion calculations for every request
      Client can cache and reuse timezone logic

    3. User experience

      Times automatically appear in user's local time
      Works correctly even if user changes timezones
      No server round-trip needed for timezone changes

## Routes that convert times to UTC: 

**Appointments** 

`api/v1/appointments` 

the POST and PATCH routes use the client's local time in the req.body: 

{
    "clientId": 4,
    "startTime": "2025-08-12T09:00:00+13:00",  // Auckland time
    "endTime": "2025-08-12T10:00:00+13:00", // Auckland time
    "appointmentType": "Edited",
    "notes": "Patched appointment"
  }

It converts the times to UTC before adding to database. 