import { TelegramIcon } from '@/components/telegram-icon'
import { WhatsAppIcon } from '@/components/whatsapp-icon'
import { Mail, Phone, type LucideIcon } from 'lucide-react'

export const channelIcons: Record<string, LucideIcon | typeof WhatsAppIcon | typeof TelegramIcon> = {
  telegram: TelegramIcon,
  whatsapp: WhatsAppIcon,
  email: Mail,
  phone: Phone,
}
