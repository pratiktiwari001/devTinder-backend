# DevTinder APIs

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
- POST /request/send/:status/:userId

- POST /request/review/:status/:requestId

## userRouter
- GET /user/requests/pending
- GET /user/connections
- GET /user/feed - Gets you the profile of other users on platform