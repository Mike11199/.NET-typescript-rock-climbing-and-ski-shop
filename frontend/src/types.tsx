interface BestsellerItem {
    category: string;
    description: string;
    images: BestsellerImage[];
    name: string;
    _id: string;
  }

interface BestsellerImage {
    path: string;
    _id: string;
  }


export { BestsellerItem };
