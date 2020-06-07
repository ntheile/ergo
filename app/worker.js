export default () => {
    alert('add event');
    this.addEventListener('message', e => { // eslint-disable-line no-restricted-globals
        alert('in event');
        setInterval(()=>{
            t = 1000;
            postMessage(t);
            alert(t);
        }, 1000)
    })
}