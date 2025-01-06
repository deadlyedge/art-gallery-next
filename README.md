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
4. ?get pic exif?
5. ~~??connect api for messages~~
6. ~~prisma schema uuid to cuid~~
7. ~~add content search~~
8. ~~show 5 messages beside pic in event page~~
9. ~~share link in contents should be supported.~~
10. ~~landing picture title show.~~
11. members conversation are separated by events, which should not. maybe should remove event and content dependencies. considering...
12. ~~show content privercy in content page.~~
13. ?upvote and downvote for a content?
14. ~~add goto my events on landing page and landing page should allow logged in users to view.~~
15. ~~try vercel for fast deployment.~~
16. ~~mobile landing page~~
17. ~~add AI Image Art Appreciation for content image description.~~
18. ~~add google safe search for image~~ 
19. ~~Current logic is, if a user come to this site with a invite code, he can sign in or sign up, and the invite code will be lost. and they can only re-paste the invite link to go to the event. which sounds complicated and doesn't make sense to me.~~ 
20. ~~signin and signup logic, invite link modified, need more test. onthought: initial a default event for new users. so sign up of login should never lost the invite code.~~
21. ~~debug /setup~~
22. ~~consider move /setup page to api route...ok forget it.~~
23. ~~remove account after clerk account deleted.~~
24. ~~move event image to content and add 'to event title image'~~
25. ~~minimal members lists in event and content pages.~~
26. unread direct messages.(new messages alert)
27. ~~landing hero start event~~
28. i18n.
29. ~~[Known Issue] User can't remove their account. Once they do remove their account and sign up back in, app will crash because the user profile already in database and the user id from clerk is different from the one in database.~~
30. [Known Issue] User can't change their email because the 'same user detection' is using email as unique identifier.
31. ~~can't use apple auth, maybe try it later with no proxy. depricated, use microsoft auth instead.~~
32. ~~consider use combined photos for general content show.~~
33. ~~image upload speed seems slow, try aws s3.~~
34. ~~use cloudfront for image delivery.~~
35. ?event theme customize?
36. add user usage meter.
37. add motions for content showing.
38. ~~image size optimize for better performance.~~
39. ~~use ipv6 for passing through the wall~~