API requests:

Users:

-PUT:
{
    "full_name": ""
}
-DELETE
-GET (one or all)


Evets:

-POST
{
    "name": "concert",
    "description": "Taylor Swift concert in Warsaw. Unforgottable event.",
    "date_start": "2024-08-01",
    "date_end": "2024-08-03"
} 
-PUT (with at least one featur)
{
    "name": "concert",
    "description": "Taylor Swift concert in Warsaw. Unforgottable event.",
    "date_start": "2024-08-01",
    "date_end": "2024-08-03"
} 
-DELETE 
-GET (one or all)


Badges:

-POST
{
    "name": ""
}
-GET (one or all)
-PUT
{
    "name": ""
}
-DELETE


Achievements:

-POST
{ 
    "name": "Good luck",
    "user_id": "FajFIoX88RYljIoWFWBOb23iVNg2", 
    "badge_id": "67ca8a6b-32d4-4408-9e54-6675f35e7b1b", 
    "no_to_completion": 10, 
    "progress": 3, 
    "completed": false
}
-GET (one or all)
-PUT
-DELETE


sync_users() POST - synchronise users with firebase

participate POST
{
    "event_id": "",
    "user_id": ""
}

assign_badge POST - can be used to assign badge to user or to event
{
    "user_id": "",
    "badge_id": ""
}
or
{
    "event_id": "",
    "badge_id": ""
}