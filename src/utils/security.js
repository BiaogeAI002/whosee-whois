import crypto from 'crypto';

export class SecurityUtils {
  static generateNonce() {
    return crypto.randomUUID();
  }

  static generateSignature(method, path, params, timestamp, nonce, secret) {
    // 参数排序
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {});
    
    // 拼接签名字符串
    const signString = `${method}|${path}|${JSON.stringify(sortedParams)}|${timestamp}|${nonce}`;
    
    // 计算HMAC
    return crypto
      .createHmac('sha256', secret)
      .update(signString)
      .digest('hex');
  }
} 