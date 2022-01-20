/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import { validator } from '@ioc:Adonis/Core/Validator'
import { URL } from 'url'

validator.rule('pronoteUrl', (value, _, options) => {
  if (typeof value !== 'string') {
    return
  }

  let url: URL | null = null
  try {
    url = new URL(value)
  } catch (error) {
    options.errorReporter.report(
      options.pointer,
      'url',
      'url validation failed',
      options.arrayExpressionPointer
    )
    return
  }

  if (!url.host.match(/^([a-zA-Z\d\-_]+.)*index-education\.net$/g)) {
    options.errorReporter.report(
      options.pointer,
      'pronote url',
      "The host of the url does not appear to be a pronote one. Please contact the administration if you're sure about it",
      options.arrayExpressionPointer
    )
  }
})
