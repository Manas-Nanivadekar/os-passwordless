import { ClassicLevel } from 'classic-level';

const randomWords = require('random-words'); // TODO: Replace with a secure random number generator

var alphaNumerical: boolean = false;

const crypto = require('crypto');

export class OTPGenerator {
  async generateOtp(user: string) {
    var otp;
    if (alphaNumerical === true) {
      otp = randomWords({ exactly: 3, join: '-' });
    } else {
      otp = crypto.randomBytes(6).toString('hex');
    }
    console.log(otp);
    const levelDB = new ClassicLevel('./db', {
      valueEncoding: 'json',
    });
    await levelDB.put(user, otp);
    levelDB.close();
    return otp;
  }

  async verifyOtp(user: string, otp: string): Promise<boolean> {
    const levelDB = new ClassicLevel('./db', {
      valueEncoding: 'json',
    });
    var storedOtp = await levelDB.get(user, { valueEncoding: 'utf8' });
    storedOtp = storedOtp.replace(/"/g, '');
    levelDB.close();
    if (storedOtp === otp) {
      await levelDB.del(user);
      return true;
    } else {
      return false;
    }
  }

  generateAlphaNumericalOtp() {
    alphaNumerical = true;
  }
}
