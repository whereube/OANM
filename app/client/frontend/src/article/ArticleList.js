import CategoryFilter from './CategoryFilter';

const ArticleList = (props) => {


    return (
        <>
            {props.viewOffers ? (
                <h1>Tillgängliga erbjudanden</h1>
            ):(
                <h1>Behov</h1>
            )}
            <CategoryFilter activeCategoryFilter={props.activeCategoryFilter} setFilterByCategory={props.setFilterByCategory}/>
            <div className='allOffersDiv'>
                {props.filteredArticles.map(article => (
                    <div key={article.id} className='offerBox'>
                        <p className='offerTitle'>{article.title}</p>
                        {article.available_digitaly ? (
                            <p className='location'>Tillgänglig digitalt</p>
                        ) : (
                            <p className='location'>Plats: {article.location}</p>
                        )
                        }
                        <p className='offerDesc'>{article.description}</p>
                        <button className='button-small offerButton'>Markera som intresserad</button>
                        <button className='button-small offerButton' onClick={() => props.navigateToArticle(article.id)}>Läs mer</button>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ArticleList