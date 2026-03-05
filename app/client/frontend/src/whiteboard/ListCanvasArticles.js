import './Canvas.css'


const ListCanvasArticles = (props) => {
    return (
        <div key={props.article.id}  className="offerNeedCard offerCard">
            <p><b>{props.article.title}</b></p>
            <div className="aboutArticle">
                <p>{props.article.description}</p>
                <p>Upplagt av: {props.article.end_user.user_name}</p>
                {props.ownArticleInterest.hasOwnProperty(props.article.id) ? (
                    <button
                        className={`button-small offerButton ${props.ownArticleInterest.hasOwnProperty(props.article.id) ? 'liked' : ''}`}
                        onClick={() => props.removeMarkAsInterested(props.ownArticleInterest[props.article.id].articleInterestId)}
                    >
                        Intresserad {props.articleInterestCounter.hasOwnProperty(props.article.id) ? props.articleInterestCounter[props.article.id].count : 0} &#128100;
                    </button>
                ) : (
                    <button
                        className={`button-small offerButton`}
                        onClick={() => props.handleInterestClick(props.article.id)}
                    >
                        Intresserad {props.articleInterestCounter.hasOwnProperty(props.article.id) ? props.articleInterestCounter[props.article.id].count : 0} &#128100;
                    </button>
                )}
            </div>
        </div>
    )

}

export default ListCanvasArticles