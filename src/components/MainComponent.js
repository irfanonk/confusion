import React, { Component } from 'react';
import Home from './HomeComponent';
import Menu from "./MenuComponent";
import DishDetail from "./DishdetailComponent";
import Contact from './ContactComponent';
import About from './AboutComponent';
import Header from './HeaderComponent'
import Footer from './FooterComponent'
// import {DISHES} from "../shared/dishes"; we store states at redux store
// import {COMMENTS} from '../shared/comments';
// import {PROMOTIONS} from '../shared/promotions';
// import {LEADERS} from '../shared/leaders'; 
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import { postFeedback, postComment, fetchDishes, fetchComments, fetchPromos, fetchLeaders } from '../redux/ActionCreators';
import {actions} from 'react-redux-form';
import {TransitionGroup, CSSTransition} from 'react-transition-group';


const mapStateToProps = state =>{
    return {
      dishes: state.dishes, //these are now available as props
      comments: state.comments,// so we use props below
      promotions: state.promotions,
      leaders: state.leaders,
       
    }
    
}
 //addComment as an action is called and dispatched
 //to be used as a function by dispatch()
 //so addComment can be used as a props
const mapDispatchToProps =(dispatch) => 
({
  postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
  // postFeedback: (id, firstname, lastname, telnum, email, agree, contactType, message  ) => 
  //   dispatch(postFeedback(id, firstname, lastname, telnum, email, agree, contactType, message )),
  postFeedback: (values) => {dispatch(postFeedback(values))},
  fetchDishes: () => {dispatch(fetchDishes())},
  fetchComments: () => {dispatch(fetchComments())},
  fetchPromos: () => {dispatch(fetchPromos())},
  fetchLeaders: () => {dispatch(fetchLeaders())},
  resetFeedbackForm : () => {dispatch(actions.reset('feedback'))},


  
})





class Main extends Component {
  

  componentDidMount () {
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchLeaders();
    //console.log('didmount:', this)
  }


  render() {
    // console.log('dish: ', this.props.dishes)
    // console.log('leader: ', this.props.leaders)
    const HomePage = () => {
      return (
        <Home 
              dish={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
              dishesLoading={this.props.dishes.isLoading}
              dishesErrMess={this.props.dishes.errMess}
              promotion={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
              promoLoading={this.props.promotions.isLoading}
              promoErrMess={this.props.promotions.errMess}
              leader={this.props.leaders.leaders.filter((leader) => leader.featured)[0]}
              leadersLoading={this.props.leaders.isLoading}
              leadersErrMess={this.props.leaders.errMess}
          /> 
      );
    }
    
    const DishWithId = ({match}) => { /*Route pass 3 props match, location, history */
      //console.log("DishWithId invoked", this.props)
      
      return (
        <DishDetail dish={this.props.dishes.dishes.filter((dish) => dish.id === parseInt(match.params.dishId,10))[0]}
            isLoading={this.props.dishes.isLoading}
            errMess={this.props.dishes.errMess}
            comments={this.props.comments.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId,10))}
            commentsErrMess={this.props.comments.errMess}
            postComment={this.props.postComment}
          />
        )
    }
    return (
       <div>
        <Header/>
        <TransitionGroup>
          <CSSTransition key={this.props.location.key} classNames="page" timeout={300}>
          <Switch>
            <Route path="/home" component ={HomePage} />
            <Route exact path="/menu" component ={() => <Menu dishes={this.props.dishes} />} /> {/* necessary to pass props */}
            <Route path="/menu/:dishId" component={DishWithId}></Route>
            <Route exact path="/contactus" component={() => <Contact postFeedback={this.props.postFeedback} resetFeedbackForm={this.props.resetFeedbackForm}/>} />
            <Route exact path="/aboutus" component={() => <About leaders={this.props.leaders.leaders} />} />
            <Redirect to="home" />
          </Switch>
          </CSSTransition>
        </TransitionGroup>
        <Footer />
      </div>

      
    );
  }
}

//to make props available, we use connect 
export default withRouter((connect(mapStateToProps, mapDispatchToProps)(Main))); //to connect component to Redux Store