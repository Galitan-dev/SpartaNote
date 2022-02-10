import Encryption from '@ioc:Adonis/Core/Encryption'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import User from './User'

export default class UserConnection extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public usedAt: DateTime

  @column()
  public userId: number

  @column()
  public cas: string

  @column()
  public url: string

  @column()
  public username: string

  @column({ serializeAs: null })
  public password: string

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Encryption.encrypt(user.password)
    }
  }

  public static async generateId() {
    let id: number
    do {
      id = Math.floor(Math.random() * 10000) // 4632, 5183, 1429, 0000 -> 9999
    } while (await this.find(id))

    return id
  }
}
