import { Notify } from 'quasar'

export function errorDetailMsg(msg) {
  if (msg.hasOwnProperty('detail')) {
    Notify.create({
      color: 'negative',
      position: 'bottom',
      message: msg.title,
      icon: 'report_problem',
      actions: [
        {
          label: msg.type, //this.$t("IIOT008.warnMSG.errorDetailMsg"),
          color: 'white',
          handler: () => {
            messageDetail(msg.detail)
          },
        },
      ],
    })
  } else {
    Notify.create({
      color: 'negative',
      position: 'bottom',
      message: msg,
      icon: 'report_problem',
    })
  }
}

function messageDetail(msg) {
  Notify.create({
    color: 'negative',
    position: 'bottom',
    message: msg,
    icon: 'report_problem',
  })
}

function add(x, y) {
  console.log(x + y)
  //  想一想如果這裡是個返回值比如： return x-y，下邊的函式怎麼引用
}
export { add }
