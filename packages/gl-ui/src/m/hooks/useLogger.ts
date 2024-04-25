import utils from '../utils/Utils'

const enum LoggerLevel {
  DEBUG = 0,
  INFO = 1,
  WARNING = 2,
  ERROR = 3
}

const dict = {
  0: 'DEBUG',
  1: 'INFO',
  2: 'WARNING',
  3: 'ERROR'
}

/**
 * 使用示例
 * const myLogger = new Logger('MyApp')
 * myLogger.debug('Debug message with parameter: {0}', 'paramValue')
 * myLogger.info('This is an info message')
 * myLogger.warning('Warning message')
 * myLogger.error('Error message with {0} and {1}', 'param1', 'param2')
 */
export class Logger {
  private readonly name: string

  constructor(name: string) {
    this.name = name
  }

  getLoglevel(): LoggerLevel {
    const loggerLevel = localStorage.getItem('LOGGER_LEVER')
    if (loggerLevel) {
      return parseInt(loggerLevel, 10)
    }
    return LoggerLevel.INFO
  }

  debug(message: string, ...optionalParams: any[]): void {
    this.log(LoggerLevel.DEBUG, message, ...optionalParams)
  }

  info(message: string, ...optionalParams: any[]): void {
    if (this.getLoglevel() === LoggerLevel.DEBUG) {
      return
    }
    this.log(LoggerLevel.INFO, message, ...optionalParams)
  }

  warning(message: string, ...optionalParams: any[]): void {
    if (this.getLoglevel() <= LoggerLevel.INFO) {
      return
    }
    this.log(LoggerLevel.WARNING, message, ...optionalParams)
  }

  error(message: string, ...optionalParams: any[]): void {
    if (this.getLoglevel() <= LoggerLevel.WARNING) {
      return
    }
    this.log(LoggerLevel.ERROR, message, ...optionalParams)
  }

  private log(level: LoggerLevel, message: string, ...optionalParams: any[]): void {
    const timestamp = utils.dateFormat(new Date(), 'HH:mm:ss')
    const formattedMessage = this.formatMessage(message, ...optionalParams)
    const logEntry = `[${dict[level]}]${timestamp} ${this.name}: ${formattedMessage}`

    switch (level) {
      case LoggerLevel.ERROR:
        console.error(logEntry,...optionalParams)
        break
      default:
        console.log(logEntry,...optionalParams)
        break
    }
  }

  private formatMessage(message: string, ...optionalParams: any[]): string {
    if (optionalParams.length === 0) {
      return message
    }
    return message.replace(/{(\d+)}/g, (match, index) => {
      return typeof optionalParams[index] !== 'undefined' ? optionalParams[index] : match
    })
  }
}

const defaultLogger = new Logger('platform')

/**
 * 获取日志器
 * @param name 日志器名称，如果为空则使用默认日志器，通过该名称区分不同的日志器
 */
const useLogger = (name?: string) => {
  if (name) {
    return new Logger(name)
  }
  return defaultLogger
}

export default useLogger
