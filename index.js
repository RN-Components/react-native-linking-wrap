import React from 'react'
import {
	Linking,
	Platform,
} from 'react-native'

const launchURL = (url) => {
  Linking.canOpenURL(url).then(supported => {
    if (!supported) {
      console.log('Can\'t handle url: ' + url)
    } else {
      return Linking.openURL(url)
    }
  }).catch(err => console.error('An unexpected error happened', err))
}
const isCorrectType = (expected, actual) => {
  return Object.prototype.toString.call(actual).slice(8, -1) === expected
}

const getValidArgumentsFromArray = (array, type) => {
  var validValues = []
  array.forEach((value) => {
    if (isCorrectType(type, value)) {
      validValues.push(value)
    }
  })

  return validValues
}
const LinkingWrap = {
  phonecall(phoneNumber, prompt) {
    if (arguments.length !== 2) {
      console.log('you must supply exactly 2 arguments')
      return
    }
    if (!isCorrectType('String', phoneNumber)) {
      console.log('the phone number must be provided as a String value')
      return
    }
    if (!isCorrectType('Boolean', prompt)) {
      console.log('the prompt parameter must be a Boolean')
      return
    }
    let url
    if (Platform.OS !== 'android') {
      url = prompt ? 'telprompt:' : 'tel:'
    } else {
      url = 'tel:'
    }
    url += phoneNumber
    launchURL(url)
  },

  /**
   * (description)
   * 发送邮件
   * @param to 字符串或多个字符串的数组
   * @param cc  字符串或多个字符串的数组
   * @param bcc 字符串或多个字符串的数组
   * @param subject 字符串
   * @param body 字符串
   */
  email(to, cc, bcc, subject, body) {
    let url = 'mailto:'
    let argLength = arguments.length

    switch (argLength) {
    case 0:
      launchURL(url)
      return
    case 5:
      break
    default:
      console.log('you must supply either 0 or 5 arguments. You supplied ' + argLength)
      return
    }
    let valueAdded = false
    if (isCorrectType('Array', arguments[0])) {
      const validAddresses = getValidArgumentsFromArray(arguments[0], 'String')

      if (validAddresses.length > 0) {
        url += validAddresses.join(',')
      }
    }
    url += '?'
    if (isCorrectType('Array', arguments[1])) {
      const validAddresses = getValidArgumentsFromArray(arguments[1], 'String')

      if (validAddresses.length > 0) {
        valueAdded = true
        url += 'cc=' + validAddresses.join(',')
      }
    }
    if (isCorrectType('Array', arguments[2])) {
      if (valueAdded) {
        url += '&'
      }
      const validAddresses = getValidArgumentsFromArray(arguments[2], 'String')
      if (validAddresses.length > 0) {
        valueAdded = true
        url += 'bcc=' + validAddresses.join(',')
      }
    }
    if (isCorrectType('String', arguments[3])) {
      if (valueAdded) {
        url += '&'
      }
      valueAdded = true
      url += 'subject=' + arguments[3]
    }
    if (isCorrectType('String', arguments[4])) {
      if (valueAdded) {
        url += '&'
      }
      url += 'body=' + arguments[4]
    }
    url = encodeURI(url)
    launchURL(url)
  },

  /**
   * (description)
   * 发送短信
   * @param phoneNumber 号码
   */
  text(phoneNumber) {
    if (arguments.length > 1) {
      console.log('you supplied too many arguments. You can either supply 0 or 1')
      return
    }
    let url = 'sms:'
    if (arguments.length !== 0) {
      if (isCorrectType('String', phoneNumber)) {
        url += phoneNumber
      } else {
        console.log('the phone number should be provided as a string. It was provided as '
        + Object.prototype.toString.call(phoneNumber).slice(8, -1)
        + ',ignoring the value provided')
      }
    }
    launchURL(url)
  },

  web(address) {
    if (!address) {
      console.log('Missing address argument')
      return
    }
    if (!isCorrectType('String', address)) {
      console.log('address was not provided as a string, it was provided as '
      + Object.prototype.toString.call(address).slice(8, -1))
      return
    }
    launchURL(address)
  },
}

export default LinkingWrap
