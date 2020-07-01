import React, { Component } from 'react';
import {Card, CardImg, CardText, CardBody, Button,CardTitle,Modal, ModalHeader, ModalBody, BreadcrumbItem, Breadcrumb,Label,Row} from 'reactstrap';
import {Link} from 'react-router-dom';
import {Control,LocalForm,Errors} from 'react-redux-form';
import {Loading} from './LoadingComponent';
import {baseUrl} from '../shared/baseUrl';
import { FadeTransform,Fade, Stagger} from 'react-animation-components';

const maxLength = (len)=>(val)=> !(val) || (val.length <= len);
const minLength = (len)=>(val)=> (val) && (val.length >= len);

class CommentForm extends Component{
    constructor(props){
        super(props);
        this.state={
            isModalOpen: false
        }
        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }

    toggleModal(){
        this.setState({
            isModalOpen: !this.state.isModalOpen
        })
    }

    handleSubmit(values){
        this.toggleModal();
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment)
    }

    render(){
        return(
            <>
                <Button outline onClick={this.toggleModal}>
                    <span className="fa fa-pencil fa-lg" ></span> Submit Comment
                </Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>
                        Submit Comment
                    </ModalHeader>
                    <ModalBody>
                        <div className="container">
                        <LocalForm onSubmit={(values)=>this.handleSubmit(values)}>
                            <Row className="form-group">
                                <Label htmlFor="rating">Rating</Label>
                                <Control.select model=".rating" id="rating" name="rating"
                                        className="form-control">
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                </Control.select>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="author">Your Name</Label>
                                <Control.text model=".author" id="author" name="author"
                                    placeholder="Your Name"
                                    className="form-control"
                                    validators={{
                                        maxLength:maxLength(15),minLength:minLength(3)
                                    }}/>
                                    <Errors
                                            className="text-danger"
                                            model=".author"
                                            show="touched"
                                            messages={{
                                                minLength: "Must be greater than 3 characters ",
                                                maxLength: "Must be 15 characters or less "
                                            }}
                                        />
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="comment">Comment</Label>
                                <Control.textarea model=".comment" id="comment" name="comment"
                                    rows="6"
                                    className="form-control"/>
                            </Row>
                            <Row className="form-group">
                            <Button className="" type="submit" value="submit" color="primary">Submit</Button>
                            </Row>
                        </LocalForm>
                        </div>
                    </ModalBody>
                </Modal>
            </>
        )
    };
}
    function RenderDish({dish}){
            return(
                <div>
                    <FadeTransform in
                        transformProps={{
                            exitTransform: 'scale(0.5) translateY(-50%)'
                        }}>
                        <Card>
                            <CardImg top width="100%" src={baseUrl + dish.image} alt={dish.name}/>
                            <CardBody>
                                <CardTitle>{dish.name}</CardTitle>
                                <CardText>{dish.description}</CardText>
                            </CardBody>
                        </Card>
                    </FadeTransform>
                </div>
            );
    }

    function RenderComments({comments, postComment, dishId}){
        if(  comments!==null )
        return(
            <div>
                <h4>Comments</h4>
                <ul className="list-unstyled">
                    <Stagger in>
                        {comments.map((comment)=>{
                            return(
                                <Fade in>
                                    <li key={comment.id}>
                                        <p>{comment.comment}</p>
                                        <p>-- {comment.author}, {new Intl.DateTimeFormat('en-US',{year:'numeric',month: 'short',day:'2-digit'}).format( new Date(Date.parse(comment.date)))}</p>
                                    </li>
                                </Fade>
                            )
                        })}
                    </Stagger>
                    <li><CommentForm dishId={dishId} postComment={postComment}/></li>
                </ul>
            </div>
        )
    }

    const DishDetail=(props)=>{
        if(props.isLoading){
            return(
                <div className="container">
                    <div className="row">
                        <Loading/>
                    </div>
                </div>
            );
        }else if(props.errMess){
            return(
                <div className="container">
                    <div className="row">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            );
        }
        else if(props.dish !=null){
        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>                
                </div>
                <div className="row">
                    <div className="col-12 col-md-5 m-1">
                        <RenderDish dish={props.dish} />
                    </div>
                    <div className="col-12 col-md-5 m-1">
                        <RenderComments comments={props.comments} 
                            postComment={props.postComment}
                            dishId={props.dish.id}
                        />
                    </div>
                </div>
            </div>
        );}
    }


export default DishDetail