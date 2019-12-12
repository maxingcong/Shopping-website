/**
 * 地址格式化
 * @param value 地址
 * @param level 显示级别
 * @param separator 分隔符
 * @returns {*}
 */
export function location(value, level, separator) {
    if (value == null) return ''
    value = String(value)
    level = level != null ? level : 4
    separator = separator != null ? separator : '^'
    return value.split(separator).slice(0, level).join(' ')
}
