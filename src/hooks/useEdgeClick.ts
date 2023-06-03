import { EdgeProps, useReactFlow } from 'reactflow';

export const uuid = (): string => new Date().getTime().toString(36) + Math.random().toString(36).slice(2);

const emojis = [
  '🍇 Grapes',
  '🍈 Melon',
  '🍉 Watermelon',
  '🍊 Tangerine',
  '🍋 Lemon',
  '🍌 Banana',
  '🍍 Pineapple',
  '🥭 Mango',
  '🍎 Red Apple',
  '🍏 Green Apple',
  '🍐 Pear',
  '🍑 Peach',
  '🍒 Cherries',
  '🍓 Strawberry',
  '🫐 Blueberries',
  '🥝 Kiwi Fruit',
  '🍅 Tomato',
  '🫒 Olive',
  '🥥 Coconut',
  '🥑 Avocado',
  '🍆 Eggplant',
  '🥔 Potato',
  '🥕 Carrot',
  '🌽 Ear of Corn',
  '🌶️ Hot Pepper',
  '🫑 Bell Pepper',
  '🥒 Cucumber',
  '🥬 Leafy Green',
  '🥦 Broccoli',
  '🧄 Garlic',
  '🧅 Onion',
  '🍄 Mushroom',
  '🥜 Peanuts',
  '🌰 Chestnut',
  '🍞 Bread',
  '🥐 Croissant',
  '🥖 Baguette Bread',
  '🫓 Flatbread',
  '🥨 Pretzel',
  '🥯 Bagel',
  '🥞 Pancakes',
  '🧇 Waffle',
  '🧀 Cheese Wedge',
  '🍖 Meat on Bone',
  '🍗 Poultry Leg',
  '🥩 Cut of Meat',
  '🥓 Bacon',
  '🍔 Hamburger',
  '🍟 French Fries',
  '🍕 Pizza',
  '🌭 Hot Dog',
  '🥪 Sandwich',
  '🌮 Taco',
  '🌯 Burrito',
  '🫔 Tamale',
  '🥙 Stuffed Flatbread',
  '🧆 Falafel',
  '🥚 Egg',
  '🍳 Cooking',
  '🥘 Shallow Pan of Food',
  '🍲 Pot of Food',
  '🫕 Fondue',
  '🥣 Bowl with Spoon',
  '🥗 Green Salad',
  '🍿 Popcorn',
  '🧈 Butter',
  '🧂 Salt',
  '🥫 Canned Food',
  '🍱 Bento Box',
  '🍘 Rice Cracker',
  '🍙 Rice Ball',
  '🍚 Cooked Rice',
  '🍛 Curry Rice',
  '🍜 Steaming Bowl',
  '🍝 Spaghetti',
  '🍠 Roasted Sweet Potato',
  '🍢 Oden',
  '🍣 Sushi',
  '🍤 Fried Shrimp',
  '🍥 Fish Cake with Swirl',
  '🥮 Moon Cake',
  '🍡 Dango',
  '🥟 Dumpling',
  '🥠 Fortune Cookie',
  '🥡 Takeout Box',
  '🦪 Oyster',
  '🍦 Soft Ice Cream',
  '🍧 Shaved Ice',
  '🍨 Ice Cream',
  '🍩 Doughnut',
  '🍪 Cookie',
  '🎂 Birthday Cake',
  '🍰 Shortcake',
  '🧁 Cupcake',
  '🥧 Pie',
  '🍫 Chocolate Bar',
  '🍬 Candy',
  '🍭 Lollipop',
  '🍮 Custard',
  '🍯 Honey Pot',
  '🍼 Baby Bottle',
  '🥛 Glass of Milk',
  '☕ Hot Beverage',
  '🫖 Teapot',
  '🍵 Teacup Without Handle',
  '🍶 Sake',
  '🍾 Bottle with Popping Cork',
  '🍷 Wine Glass',
  '🍸 Cocktail Glass',
  '🍹 Tropical Drink',
  '🍺 Beer Mug',
  '🍻 Clinking Beer Mugs',
  '🥂 Clinking Glasses',
  '🥃 Tumbler Glass',
  '🥤 Cup with Straw',
  '🧋 Bubble Tea',
  '🧃 Beverage Box',
  '🧉 Mate',
  '🧊 Ice',
  '🥢 Chopsticks',
  '🍽️ Fork and Knife with Plate',
  '🍴 Fork and Knife',
  '🥄 Spoon',
];

export const randomLabel = (): string => {
  return emojis[~~(Math.random() * emojis.length)];
};

// this hook implements the logic for clicking the button on a workflow edge
// on edge click: create a node in between the two nodes that are connected by the edge
function useEdgeClick(id: EdgeProps['id']) {
  const { setEdges, setNodes, getNode, getEdge } = useReactFlow();

  const handleEdgeClick = () => {
    // first we retrieve the edge object to get the source and target id
    const edge = getEdge(id);

    if (!edge) {
      return;
    }

    // we retrieve the target node to get its position
    const targetNode = getNode(edge.target);

    if (!targetNode) {
      return;
    }

    // create a unique id for newly added elements
    const insertNodeId = uuid();

    // this is the node object that will be added in between source and target node
    const insertNode = {
      id: insertNodeId,
      // we place the node at the current position of the target (prevents jumping)
      position: { x: targetNode.position.x, y: targetNode.position.y },
      data: { label: randomLabel() },
      type: 'workflow',
    };

    // new connection from source to new node
    const sourceEdge = {
      id: `${edge.source}->${insertNodeId}`,
      source: edge.source,
      target: insertNodeId,
      type: 'workflow',
    };

    // new connection from new node to target
    const targetEdge = {
      id: `${insertNodeId}->${edge.target}`,
      source: insertNodeId,
      target: edge.target,
      type: 'workflow',
    };

    // remove the edge that was clicked as we have a new connection with a node inbetween
    setEdges(edges => edges.filter(e => e.id !== id).concat([sourceEdge, targetEdge]));

    // insert the node between the source and target node in the react flow state
    setNodes(nodes => {
      const targetNodeIndex = nodes.findIndex(node => node.id === edge.target);

      return [...nodes.slice(0, targetNodeIndex), insertNode, ...nodes.slice(targetNodeIndex, nodes.length)];
    });
  };

  return handleEdgeClick;
}

export default useEdgeClick;
