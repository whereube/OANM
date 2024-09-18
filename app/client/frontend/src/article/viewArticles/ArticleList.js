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
                        <div className='articleText'>
                            <p className='offerTitle'>{article.title}</p>
                            <p className='offerDesc'>{article.description.substr(0, 200)}{article.description.length > 200 ? '...' : ''}</p>
                        </div>
                        <div className='articleButtons'>
                            <button className='button-small offerButton'>Markera som intresserad</button>
                            <button className='button-small offerButton' onClick={() => props.navigateToArticle(article.id)}>Läs mer</button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ArticleList