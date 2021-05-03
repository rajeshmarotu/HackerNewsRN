export let cancelCallback = () => {};

const sleep = period => {
  return new Promise(resolve => {
    cancelCallback = () => {
      return resolve('CANCELLED');
    };
    setTimeout(() => {
      resolve('WAKE_UP');
    }, period);
  });
};

export const poll = (promiseFn, period) =>
  promiseFn().then(() => {
    let asleep = async period => {
      let respond = await sleep(period);
      return respond;
    };

    asleep(period).then(respond => {
      if (respond !== 'CANCELLED') {
        poll(promiseFn, period);
      } else {
        console.log(respond);
      }
    });
  });
