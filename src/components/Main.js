require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';


var photos = new Array();
for (var i = 1; i < 15; i++) {
	var singlePhoto = {
		fileName : i + ".jpg",
		title : "infomage --- " + i,
		desc :"desc + ==" + i,
		imgUrl : ""
	}
	singlePhoto.imgUrl = require("../images/"+singlePhoto.fileName);

	photos[i] = singlePhoto;
}

// 根据范围取值：
function getRangeRandom(low,high){
	return Math.ceil(Math.random()*(high - low) + low);
}
// 限制旋转角度：
function get30degreeRandom(){
	return ((Math.random()>0.5? "":"-") + Math.ceil(Math.random()*30));
}


// 组件：背景框架
var StageOutter = React.createClass({

	Constant:{
		centerPos:{
			left:0,
			top:0
		},

		hPosRange:{ //水平方向的位置参数
			leftSecX:[0,0],
			rightSecX:[0,0],
			y:[0,0]
		},

		vPosRange:{ //垂直
			x:[0,0],
			topY:[0,0]
		}
	},



	/*
	 * 翻转
	 * index 决定哪个图为翻转
	 * return{Function} 返回一闭包函数,其内包含一个真正待被执行的函数
	*/
	inverse:function(index){
		return function(){
			var imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
			this.setState({
				imgsArrangeArr:imgsArrangeArr 
			});
		}.bind(this);
	},


	/*
	 * 重新布局图片
	 * centerIndex 决定哪个图为中心
	*/
	rearrage: function(centerIndex){
		var imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos =Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,

			imgsArrangeTopArr = [],
			// 取一个或者不取
			topImgNum = Math.ceil(Math.random()*2),
			topImgSpliceIndex = 0,
			// 从centerIndex 剔出1个存入imgsArrangeCenterArr
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

			// 居中：

			imgsArrangeCenterArr[0].pos = centerPos;
			imgsArrangeCenterArr[0].rotate = 0;
			imgsArrangeCenterArr[0].isCenter = true;
			// 取出要布局的上册的图片的状态信息
			topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length - topImgNum));
			imgsArrangeTopArr =imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

			// 布局上方的图片
			imgsArrangeTopArr.forEach(function(value,index){

				imgsArrangeTopArr[index] = {
					pos:{
						top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
						left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
					},
					rotate:get30degreeRandom(),
					isCenter:false
				};
			});

			// 布局左右的图片
			for(var i = 0, j = imgsArrangeArr.length, k = j/2; i < j; i++){
				var hPosRangeLORX = null;
				if (i < k) {
					hPosRangeLORX = hPosRangeLeftSecX;
				}else{
					hPosRangeLORX = hPosRangeRightSecX;
				}

				imgsArrangeArr[i] = {
					pos : {
						top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
						left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
					},
					rotate:get30degreeRandom(),
					isCenter:false
				};
				
			}


			if (imgsArrangeTopArr&&imgsArrangeTopArr[0]) {
				imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
			}

			imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

			this.setState({
				imgsArrangeArr:imgsArrangeArr
			});

	},



	/*
	 * 利用rearrange函数重新选定中心
	 * centerIndex 决定哪个图为中心
	*/
	center:function(centerIndex){
		return function(){
			this.rearrage(centerIndex);
		}.bind(this);
	},





	getInitialState: function(){
		return{
			imgsArrangeArr:[
				// {
				// 	pos:{
				// 		left:"0",
				// 		top:"0"
				// 	},
				// 	rotate: 0,
				// 	isInverse: false, //false 为正面,true 为反面
				// 	isCenter: false
				// }
			]
		};
	},

	//组件加载完毕后计算图片位置
	componentDidMount:function(){

		var stageDOM = this.refs.stage;
		var stageW = stageDOM.scrollWidth;
		var stageH = stageDOM.scrollHeight;
		//scrollWidth :不包含滚动条以及超出部分的宽
		//offsetWidth :包含。。。
		var halfStageW = Math.ceil(stageW/2);
		var halfStageH = Math.ceil(stageH/2);
		// 组件需要通过findDomNode获得
		var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure1);

		var imgW = imgFigureDOM.scrollWidth;
		var imgH = imgFigureDOM.scrollHeight;

		var halfImgW = Math.ceil(imgW/2);
		var halfImgH = Math.ceil(imgH/2);


		this.Constant.centerPos = {
			left:halfStageW - halfImgW,
			top:halfStageH - halfImgH
		}

		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;

		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;

		this.rearrage(0);
		
	},

	

	render:function(){
		var controllerUnit = [];
		var imgFigures = [];

		photos.forEach(function(value,index ){

			index --;
			if (!this.state.imgsArrangeArr[index]) {
				this.state.imgsArrangeArr[index] = {
					pos:{
						left:0,
						top:0
					},
					rotate:0,
					isInverse:false,
					isCenter:false
				}
			}

			imgFigures.push(<ImgFigure data = {value} ref ={"imgFigure"+index} 
				arrange = {this.state.imgsArrangeArr[index]} 
				inverse = {this.inverse(index)}
				center = {this.center(index)}
				/>);
		}.bind(this));

		return(
			<section className = "stage" ref = "stage">
				<section className = "img-sec">
					{imgFigures}
				</section>
				<nav className = "controller">
					{controllerUnit}
				</nav>
			</section>
			);
	}
});


// 组件：单个照片
var ImgFigure = React.createClass({

	handleClick:function(event){
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		}else{
			this.props.center();
		}
		

		event.stopPropagation();
		event.preventDefault();
	},

	render:function(){

		var styleObj = {};

		// 若props中指定了图片位置，则使用所指定的位置。
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
			
		}

		// 若props中指定了图片旋转角度，则使用。
		if(this.props.arrange.rotate){

			(['-moz-','-ms-','-webkit-','']).forEach(function(value){
				styleObj[value +'transform'] = "rotate("+ this.props.arrange.rotate+"deg)";
			}.bind(this));
		}

		if (this.props.arrange.isCenter) {
			styleObj.zIndex = 11;
		}

		var imgFigureClassName = "img-figure";
		imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse': "";


		return (
			<figure className = {imgFigureClassName} style = {styleObj} onClick = {this.handleClick}>
				<img src = {this.props.data.imgUrl}
					 alt = {this.props.data.title}
				/>
				<figcaption>
					<h2 className = "img-title">{this.props.data.title}</h2>
					<div className = "img-back" onClick = {this.handleClick}>
						<p>
							{this.props.data.desc}
						</p>
					</div>
				</figcaption>
			</figure>
			);
	}
});




class AppComponent extends React.Component {
  render() {
    return (
      <StageOutter/>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
