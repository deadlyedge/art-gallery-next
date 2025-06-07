# before everything

this project is based on 'fullstack Discord Clone' (https://www.codewithantonio.com/projects/team-chat-platform) on code with antonio (https://www.codewithantonio.com/), which I learnt a lot from.

socket chat function has been removed, because i throught this should
be a content focused site.

# test site

https://aganx.com/
(fresh settings: please sign up and create a new event to play with)

# todo:
- [x] complete add content logic: general content need to be changed but not to be deleted
- [x] add content description error in ~~db~~ api perhaps: solved
- [x] ??connect api for messages
- [x] prisma schema uuid to cuid
- [x] add content search
- [x] show 5 messages beside pic in event page
- [x] share link in contents should be supported.
- [x] landing picture title show.
- [x] show content privercy in content page.
- [x] add goto my events on landing page and landing page should allow logged in users to view.
- [x] try vercel for fast deployment.
- [x] mobile landing page
- [x] add AI Image Art Appreciation for content image description.
- [x] add google safe search for image
- [x] Current logic is, if a user come to this site with a invite code, he can sign in or sign up, and the invite code will be lost. and they can only re-paste the invite link to go to the event. which sounds complicated and doesn't make sense to me.
- [x] signin and signup logic, invite link modified, need more test. onthought: initial a default event for new users. so sign up of login should never lost the invite code.
- [x] debug /setup
- [x] consider move /setup page to api route...ok forget it.
- [x] remove account after clerk account deleted.
- [x] move event image to content and add 'to event title image'
- [x] minimal members lists in event and content pages.
- [x] landing hero start event
- [x] can't use apple auth, maybe try it later with no proxy. depricated, use microsoft auth instead.
- [x] consider use combined photos for general content show.
- [x] image upload speed seems slow, try aws s3.
- [x] use cloudfront for image delivery.
- [x] image size optimize for better performance.
- [x] use ipv6 for passing through the wall
- [ ] page ui
- [ ] get pic exif?
- [ ] members conversation are separated by events, which should not. maybe should remove event and content dependencies. considering...
- [ ] upvote and downvote for a content?
- [ ] unread direct messages.(new messages alert)
- [ ] i18n.
- [ ] [Known Issue] User can't remove their account. Once they do remove their account and sign up back in, app will crash because the user profile already in database and the user id from clerk is different from the one in database.
- [ ] [Known Issue] User can't change their email because the 'same user detection' is using email as unique identifier.
- [ ] event theme customize?
- [ ] add user usage meter.
- [ ] add motions for content showing.
- [ ] add auto pagination for contents
- [ ] fix mobile contents view
- [ ] fix params interface for every page
- [ ] try drizzle/trpc for better performance
