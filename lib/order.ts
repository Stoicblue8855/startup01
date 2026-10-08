// Public business WhatsApp number (country code + number, digits only).
export const WHATSAPP_NUMBER = '918855017033'

export const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
  'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal',
]

export function whatsappLink(message: string, number: string = WHATSAPP_NUMBER) {
  const digits = (number || WHATSAPP_NUMBER).replace(/[^0-9]/g, '') || WHATSAPP_NUMBER
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}
