import React from 'react'

const page = () => {

    const gifUrls = [
        {title: "https://drive.google.com/file/d/1aSBYLeIVFbTaiR4OLuwQVrzsy8Vc134y/view?usp=drive_link", id: 1},
        {
            title: "https://drive.google.com/uc?export=view&id=1YSXSIYoLIA3buGr6oOIn0sdwXhDsnD4C", id:2, },
        {
            title: "https://drive.google.com/uc?export=view&id=1aN2dsYw08k5wt1xaWfLmpLTFKZ1eHsY-", id: 3,},
        {
            title: "https://drive.google.com/uc?export=view&id=1a5GO3ef43_mnJTOsIVPxkYdiHZfKEoL8", id:4, },
        {
            title: "https://drive.google.com/uc?export=view&id=1a5oFYwDil1wK67rgBTwg1OyRBR0EaRr5", id:5, },
       {
        title:  "https://drive.google.com/uc?export=view&id=1a24L5pmbigei4oSj9nXb4l4681ItO5qf", id:6, }
      ];

  return (
    <div>
      ;fks;;
      {
        gifUrls.map(item => {
            return (
                <div key={item.id}>
                    <video width="750" height="500"  autoPlay muted >
      <source src={item.title}  type="video/mp4"  />
</video>
                </div>
            )
        })
      }

    </div>
  )
}

export default page
