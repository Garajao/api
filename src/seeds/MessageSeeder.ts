import { DataSource } from 'typeorm'
import { Seeder } from 'typeorm-extension'

import { Message } from '../entities/Message'

export class MessageSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const messageRepository = dataSource.getRepository(Message)

    const messagesData = [
      {
        id: 1,
        description: 'Opened gate',
      },
      {
        id: 2,
        description: 'Closed gate',
      },
      {
        id: 3,
        description: 'Loading...',
      },
      {
        id: 4,
        description: 'Invalid code',
      },
      {
        id: 5,
        description: 'Code out of sequence',
      },
      {
        id: 6,
        description: 'Expired code',
      },
    ]

    const newMessage = messageRepository.create(messagesData)
    await messageRepository.save(newMessage)
  }
}
