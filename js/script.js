'use strict';

function titleClickHandler(event) {
    event.preventDefault();
    const clickedElement = this;
    console.log(event);
    /* remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll(".titles a.active");
    
    for (let activeLink of activeLinks) {
        activeLink.classList.remove('active');
        console.log('Klasa acrive usunieta')
    }

    /* add class 'active' to the clicked link */
    console.log('clickedElement:', clickedElement);
    clickedElement.classList.add('active');
    
    /* remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.post');
    for(let activeArticle of activeArticles) {
        activeArticle.classList.remove('active');
    }
    /* get 'href' attribute from the clicked link */
    const attribute = clickedElement.getAttribute('href');
    console.log(attribute);

    /* find the correct article using the selector (value of 'href' attribute) */
    const articleTarget = document.querySelector(attribute);
    console.log(articleTarget);
    /* add class 'active' to the correct article */
    articleTarget.classList.add('active');
}

const links = document.querySelectorAll('.titles a');   

for (let link of links) { 
    link.addEventListener('click', titleClickHandler);
}
