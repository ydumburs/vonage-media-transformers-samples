# Background Effects Sample Application
This sample application applies some background visual effects by using the [@vonage/ml-transformers](https://www.npmjs.com/package/@vonage/ml-transformers) library and establishing a video call with Video API.
# Demo
You can see a live demo of this sample running [here](https://vonage-background-enchantments-sample.s3.amazonaws.com/index.html)
# Building the application
1. Configure the environment
```
npm I
```
2. Add your session credentials on `js/config.js`
3. Run dev version
```
npm run dev
```
## Run production version

    npm run build
    npm run preview

# Using the library in a real use case
This sample apps renders the result of the video captured from the camera on the right side canvas.
Some real use case for this library would be using it along with [OT.Publisher](https://tokbox.com/developer/guides/vonage-media-processor/js/#publisher-setvideomediaprocessorconnector-method).
In our *main.ts* you can see this code chunk:
```typescript
...
videoSource_.setMediaProcessorConnector(connector).then(() => {
	console.log('ok')
}).catch( e  => {
	console.error(e)
})
...
```
All you need to do is changed it with this code:
```typescript
...
publisher.setVideoMediaProcessorConnector(connector).then(() => {
    console.log('ok')
}).catch( e  => {
	console.error(e)
})
...
```
# Use in Vonage Unified environment
1. Change the library name from `@opentok/client` to `@vonage/client-sdk-video` in `package.json` and `opentok.ts`.
2. Obtain Session credentials from the Unified dashboard and add them in `js/config.js`.
