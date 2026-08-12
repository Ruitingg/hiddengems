const pad2 = (n) => String(n).padStart(2, '0')

const tlv = (tag, value) => `${tag}${pad2(value.length)}${value}`

const crc16 = (str) => {
    let crc = 0xffff
    for (let i = 0; i < str.length; i++) {
        crc ^= str.charCodeAt(i) << 8
        for (let j = 0; j < 8; j++) {
            crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1)
            crc &= 0xffff
        }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0')
}

const normalizeMobile = (rawNumber) => {
    const digits = rawNumber.replace(/[^\d]/g, '')
    if (digits.length === 8) return `+65${digits}`
    if (digits.length === 10 && digits.startsWith('65')) return `+${digits}`
    if (rawNumber.startsWith('+')) return rawNumber
    return `+65${digits}`
}

export const buildPayNowQRPayload = ({
    paynowNumber,
    amount,
    reference,
    merchantName,
    editable = false,
}) => {
    const mobile = normalizeMobile(paynowNumber)
    const amountStr = Number(amount).toFixed(2)
    const nameField = (merchantName || 'HiddenGems Seller').slice(0, 25)
    const refField = (reference || '').slice(0, 25)

    const payNowMerchantAccountInfo =
        tlv('00', 'SG.PAYNOW') +
        tlv('01', '0') +
        tlv('02', mobile) +
        tlv('03', editable ? '1' : '0')

    const billReference = tlv('01', refField)

    const payloadWithoutCRC =
        tlv('00', '01') +
        tlv('01', '12') +
        tlv('26', payNowMerchantAccountInfo) +
        tlv('52', '0000') +
        tlv('53', '702') +
        tlv('54', amountStr) +
        tlv('58', 'SG') +
        tlv('59', nameField) +
        tlv('60', 'Singapore') +
        (refField ? tlv('62', billReference) : '') +
        '6304'

    return payloadWithoutCRC + crc16(payloadWithoutCRC)
}