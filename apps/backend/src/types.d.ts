import 'express'

declare module 'express' {
  interface Request {
    params: Record<string, string>
  }
}

declare module 'twilio' {
  function Twilio(accountSid: string, authToken: string): any
  export default Twilio
}
