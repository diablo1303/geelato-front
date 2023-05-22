// 当页面渲染完毕后马上调用下面的函数，这个函数是在当前页面 - 设置 - 生命周期 - 页面加载完成时中被关联的。
function didMount() {
  console.log(`「页面 JS」：当前页面地址 ${location.href}`);
  // console.log(`「页面 JS」：当前页面 id 参数为 ${this.state.urlParams.id}`);
  // 更多 this 相关 API 请参考：
  // document.title = window.loginUser.userName + ' | Geelato';
}

function showView() {

}

