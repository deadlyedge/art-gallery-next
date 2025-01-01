# before everything

this project is based on 'fullstack Discord Clone' (https://www.codewithantonio.com/projects/team-chat-platform) on code with antonio (https://www.codewithantonio.com/), which I learnt a lot from.

socket chat function has been removed, because i throught this should
be a content focused site.

# test site

https://aganx.com/
(fresh settings: please sign up and create a new event to play with)

# todo:
1. page ui
2. ~~complete add content logic: general content need to be changed but not to be deleted~~
3. ~~add content description error in ~~db~~ api perhaps: solved~~
4. get pic exif
5. ~~??connect api for messages~~
6. ~~prisma schema uuid to cuid~~
7. ~~add content search~~
8. ~~show 5 messages beside pic in event page~~
9. ~~share link in contents should be supported.~~
10. ~~landing picture title show.~~
11. members conversation are separated by events, which should not. maybe should remove event and content dependencies. considering...
12. ~~show content privercy in content page.~~
13. upvote and downvote for a content
14. ~~add goto my events on landing page and landing page should allow logged in users to view.~~
15. signin and signup logic, invite link modified, need more test. Current logic is, if a user come to this site with a invite code, he can sign in or sign up, and the invite code will be lost. and they can only re-paste the invite link to go to the event. which sounds complicated and doesn't make sense to me. onthought: initial a default event for new users. so sign up of login should never lost the invite code.
16. ~~try vercel for fast deployment.~~
17. ~~mobile landing page~~
18. ~~add AI Image Art Appreciation for content image description.~~
19. ~~add google safe search for image~~ 
20. debug /setup
21. move event image to content and add 'to event title image'
22. minimal members lists in event and content pages.
23. unread direct messages.(new messages alert)