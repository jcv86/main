import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Complete list of 139 books from your library
const books = [
  { title: 'Designing Your Life', author: 'Bill Burnett & Dave Evans', category: 'Career' },
  { title: 'Drive', author: 'Daniel H. Pink', category: 'Motivation' },
  { title: 'Grit', author: 'Angela Duckworth', category: 'Personal Development' },
  { title: 'Mindset', author: 'Carol S. Dweck', category: 'Personal Development' },
  { title: 'Peak', author: 'Anders Ericsson & Robert Pool', category: 'Learning' },
  { title: 'Range', author: 'David Epstein', category: 'Learning' },
  { title: 'So Good They Can\'t Ignore You', author: 'Cal Newport', category: 'Career' },
  { title: 'The 2-Hour Job Search', author: 'Steve Dalton', category: 'Career' },
  { title: 'The First 90 Days', author: 'Michael D. Watkins', category: 'Career' },
  { title: 'What Color Is Your Parachute?', author: 'Richard N. Bolles', category: 'Career' },
  { title: 'Atomic Habits', author: 'James Clear', category: 'Habits' },
  { title: 'Deep Work', author: 'Cal Newport', category: 'Productivity' },
  { title: 'Eat That Frog!', author: 'Brian Tracy', category: 'Productivity' },
  { title: 'Essentialism', author: 'Greg McKeown', category: 'Productivity' },
  { title: 'Getting Things Done', author: 'David Allen', category: 'Productivity' },
  { title: 'Make Time', author: 'Jake Knapp & John Zeratsky', category: 'Productivity' },
  { title: 'The One Thing', author: 'Gary Keller & Jay Papasan', category: 'Focus' },
  { title: 'The Power of Habit', author: 'Charles Duhigg', category: 'Habits' },
  { title: 'Tiny Habits', author: 'BJ Fogg', category: 'Habits' },
  { title: 'Ultralearning', author: 'Scott Young', category: 'Learning' },
  { title: 'HBR Guide to Better Business Writing', author: 'Bryan A. Garner', category: 'Writing' },
  { title: 'Made to Stick', author: 'Chip Heath & Dan Heath', category: 'Communication' },
  { title: 'On Writing Well', author: 'William Zinsser', category: 'Writing' },
  { title: 'Presentation Zen', author: 'Garr Reynolds', category: 'Presentation' },
  { title: 'Resonate', author: 'Nancy Duarte', category: 'Presentation' },
  { title: 'Talk Like TED', author: 'Carmine Gallo', category: 'Presentation' },
  { title: 'The Elements of Style', author: 'William Strunk Jr. & E. B. White', category: 'Writing' },
  { title: 'The Pyramid Principle', author: 'Barbara Minto', category: 'Communication' },
  { title: 'The Sense of Style', author: 'Steven Pinker', category: 'Writing' },
  { title: 'Writing That Works', author: 'Kenneth Roman & Joel Raphaelson', category: 'Writing' },
  { title: 'Crucial Conversations', author: 'Kerry Patterson, Joseph Grenny, Ron McMillan & Al Switzler', category: 'Communication' },
  { title: 'Getting to Yes', author: 'Roger Fisher, William Ury & Bruce Patton', category: 'Negotiation' },
  { title: 'Give and Take', author: 'Adam Grant', category: 'Relationships' },
  { title: 'How to Win Friends and Influence People', author: 'Dale Carnegie', category: 'Relationships' },
  { title: 'Influence', author: 'Robert B. Cialdini', category: 'Psychology' },
  { title: 'Never Eat Alone', author: 'Keith Ferrazzi & Tahl Raz', category: 'Networking' },
  { title: 'Never Split the Difference', author: 'Chris Voss & Tahl Raz', category: 'Negotiation' },
  { title: 'Pre-Suasion', author: 'Robert B. Cialdini', category: 'Psychology' },
  { title: 'The Charisma Myth', author: 'Olivia Fox Cabane', category: 'Communication' },
  { title: 'The Like Switch', author: 'Jack Schafer & Marvin Karlins', category: 'Relationships' },
  { title: 'Extreme Ownership', author: 'Jocko Willink & Leif Babin', category: 'Leadership' },
  { title: 'High Output Management', author: 'Andrew S. Grove', category: 'Management' },
  { title: 'Leaders Eat Last', author: 'Simon Sinek', category: 'Leadership' },
  { title: 'Multipliers', author: 'Liz Wiseman', category: 'Leadership' },
  { title: 'Radical Candor', author: 'Kim Scott', category: 'Management' },
  { title: 'Team of Teams', author: 'Stanley McChrystal', category: 'Leadership' },
  { title: 'The Culture Code', author: 'Daniel Coyle', category: 'Culture' },
  { title: 'The Effective Executive', author: 'Peter F. Drucker', category: 'Management' },
  { title: 'The Five Dysfunctions of a Team', author: 'Patrick Lencioni', category: 'Team' },
  { title: 'Turn the Ship Around!', author: 'L. David Marquet', category: 'Leadership' },
  { title: 'Blue Ocean Strategy', author: 'W. Chan Kim & Renée Mauborgne', category: 'Strategy' },
  { title: 'Execution', author: 'Larry Bossidy & Ram Charan', category: 'Strategy' },
  { title: 'Good to Great', author: 'Jim Collins', category: 'Strategy' },
  { title: 'HBR\'s 10 Must Reads on Strategy', author: 'Harvard Business Review', category: 'Strategy' },
  { title: 'Measure What Matters', author: 'John Doerr', category: 'Goals' },
  { title: 'Playing to Win', author: 'A.G. Lafley & Roger L. Martin', category: 'Strategy' },
  { title: 'The Balanced Scorecard', author: 'Robert S. Kaplan & David P. Norton', category: 'Metrics' },
  { title: 'The Goal', author: 'Eliyahu M. Goldratt', category: 'Operations' },
  { title: 'The Innovator\'s Dilemma', author: 'Clayton M. Christensen', category: 'Innovation' },
  { title: 'Working Backwards', author: 'Colin Bryar & Bill Carr', category: 'Product' },
  { title: 'Continuous Discovery Habits', author: 'Teresa Torres', category: 'Product' },
  { title: 'Crossing the Chasm', author: 'Geoffrey A. Moore', category: 'Marketing' },
  { title: 'Empowered', author: 'Marty Cagan & Chris Jones', category: 'Product' },
  { title: 'Escaping the Build Trap', author: 'Melissa Perri', category: 'Product' },
  { title: 'Inspired', author: 'Marty Cagan', category: 'Product' },
  { title: 'Lean Analytics', author: 'Alistair Croll & Benjamin Yoskovitz', category: 'Analytics' },
  { title: 'Sprint', author: 'Jake Knapp, John Zeratsky & Braden Kowitz', category: 'Product' },
  { title: 'The Lean Product Playbook', author: 'Dan Olsen', category: 'Product' },
  { title: 'The Mom Test', author: 'Rob Fitzpatrick', category: 'Product' },
  { title: 'Alchemy', author: 'Rory Sutherland', category: 'Marketing' },
  { title: 'Building a StoryBrand', author: 'Donald Miller', category: 'Marketing' },
  { title: 'Contagious', author: 'Jonah Berger', category: 'Marketing' },
  { title: 'Hacking Growth', author: 'Sean Ellis & Morgan Brown', category: 'Growth' },
  { title: 'Hooked', author: 'Nir Eyal', category: 'Product' },
  { title: 'Marketing Management', author: 'Philip Kotler & Kevin Lane Keller', category: 'Marketing' },
  { title: 'Play Bigger', author: 'Al Ramadan, Dave Peterson, Christopher Lochhead & Kevin Maney', category: 'Strategy' },
  { title: 'Positioning', author: 'Al Ries & Jack Trout', category: 'Marketing' },
  { title: 'Purple Cow', author: 'Seth Godin', category: 'Marketing' },
  { title: 'This Is Marketing', author: 'Seth Godin', category: 'Marketing' },
  { title: '101 Design Methods', author: 'Vijay Kumar', category: 'Design' },
  { title: 'About Face', author: 'Alan Cooper, Robert Reimann, David Cronin & Christopher Noessel', category: 'Design' },
  { title: 'Creative Confidence', author: 'Tom Kelley & David Kelley', category: 'Design' },
  { title: 'Designing for the Digital Age', author: 'Kim Goodwin', category: 'Design' },
  { title: 'Don\'t Make Me Think', author: 'Steve Krug', category: 'UX' },
  { title: 'Lean UX', author: 'Jeff Gothelf & Josh Seiden', category: 'Design' },
  { title: 'Refactoring UI', author: 'Adam Wathan & Steve Schoger', category: 'Design' },
  { title: 'Seductive Interaction Design', author: 'Stephen Anderson', category: 'Design' },
  { title: 'The Design of Everyday Things', author: 'Don Norman', category: 'Design' },
  { title: 'The Elements of User Experience', author: 'Jesse James Garrett', category: 'UX' },
  { title: 'An Introduction to Statistical Learning', author: 'Gareth James, Daniela Witten, Trevor Hastie & Robert Tibshirani', category: 'Data' },
  { title: 'Be Data Literate', author: 'Jordan Morrow', category: 'Data' },
  { title: 'Data Science for Business', author: 'Foster Provost & Tom Fawcett', category: 'Data' },
  { title: 'How Charts Lie', author: 'Alberto Cairo', category: 'Visualization' },
  { title: 'Naked Statistics', author: 'Charles Wheelan', category: 'Statistics' },
  { title: 'Storytelling with Data', author: 'Cole Nussbaumer Knaflic', category: 'Visualization' },
  { title: 'The Signal and the Noise', author: 'Nate Silver', category: 'Data' },
  { title: 'The Visual Display of Quantitative Information', author: 'Edward R. Tufte', category: 'Visualization' },
  { title: 'Thinking with Data', author: 'Max Shron', category: 'Data' },
  { title: 'Weapons of Math Destruction', author: 'Cathy O\'Neil', category: 'Data' },
  { title: 'A Philosophy of Software Design', author: 'John Ousterhout', category: 'Engineering' },
  { title: 'Accelerate', author: 'Nicole Forsgren, Jez Humble & Gene Kim', category: 'DevOps' },
  { title: 'Clean Architecture', author: 'Robert C. Martin', category: 'Engineering' },
  { title: 'Clean Code', author: 'Robert C. Martin', category: 'Engineering' },
  { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', category: 'Engineering' },
  { title: 'System Design Interview', author: 'Alex Xu', category: 'Engineering' },
  { title: 'The DevOps Handbook', author: 'Gene Kim, Jez Humble, Patrick Debois & John Willis', category: 'DevOps' },
  { title: 'The Manager\'s Path', author: 'Camille Fournier', category: 'Management' },
  { title: 'The Phoenix Project', author: 'Gene Kim, Kevin Behr & George Spafford', category: 'DevOps' },
  { title: 'The Pragmatic Programmer', author: 'Andrew Hunt & David Thomas', category: 'Engineering' },
  { title: 'Antifragile', author: 'Nassim Nicholas Taleb', category: 'Philosophy' },
  { title: 'Noise', author: 'Daniel Kahneman, Olivier Sibony & Cass R. Sunstein', category: 'Psychology' },
  { title: 'Nudge', author: 'Richard H. Thaler & Cass R. Sunstein', category: 'Behavioral' },
  { title: 'Predictably Irrational', author: 'Dan Ariely', category: 'Psychology' },
  { title: 'Skin in the Game', author: 'Nassim Nicholas Taleb', category: 'Philosophy' },
  { title: 'Superforecasting', author: 'Philip E. Tetlock & Dan Gardner', category: 'Decision Making' },
  { title: 'The Art of Thinking Clearly', author: 'Rolf Dobelli', category: 'Thinking' },
  { title: 'The Checklist Manifesto', author: 'Atul Gawande', category: 'Systems' },
  { title: 'The Paradox of Choice', author: 'Barry Schwartz', category: 'Psychology' },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', category: 'Psychology' },
  { title: 'A Technique for Producing Ideas', author: 'James Webb Young', category: 'Creativity' },
  { title: 'Show Your Work!', author: 'Austin Kleon', category: 'Creativity' },
  { title: 'Steal Like an Artist', author: 'Austin Kleon', category: 'Creativity' },
  { title: 'Story', author: 'Robert McKee', category: 'Storytelling' },
  { title: 'Storyworthy', author: 'Matthew Dicks', category: 'Storytelling' },
  { title: 'The Anatomy of Story', author: 'John Truby', category: 'Storytelling' },
  { title: 'The Artist\'s Way', author: 'Julia Cameron', category: 'Creativity' },
  { title: 'The Creative Habit', author: 'Twyla Tharp', category: 'Creativity' },
  { title: 'The Hero with a Thousand Faces', author: 'Joseph Campbell', category: 'Storytelling' },
  { title: 'The War of Art', author: 'Steven Pressfield', category: 'Creativity' },
  { title: 'A Random Walk Down Wall Street', author: 'Burton G. Malkiel', category: 'Finance' },
  { title: 'Accounting Made Simple', author: 'Mike Piper', category: 'Finance' },
  { title: 'Common Sense on Mutual Funds', author: 'John C. Bogle', category: 'Finance' },
  { title: 'Financial Intelligence', author: 'Karen Berman & Joe Knight', category: 'Finance' },
  { title: 'I Will Teach You to Be Rich', author: 'Ramit Sethi', category: 'Finance' },
  { title: 'Rich Dad Poor Dad', author: 'Robert T. Kiyosaki & Sharon Lechter', category: 'Finance' },
  { title: 'The Little Book of Common Sense Investing', author: 'John C. Bogle', category: 'Finance' },
  { title: 'The Personal MBA', author: 'Josh Kaufman', category: 'Business' },
  { title: 'The Psychology of Money', author: 'Morgan Housel', category: 'Finance' },
  { title: 'The Simple Path to Wealth', author: 'JL Collins', category: 'Finance' },
]

async function loadBooks() {
  try {
    console.log(`Starting to load ${books.length} books...`)

    // Clear existing books (optional)
    // await supabase.from('knowledge_base').delete().neq('id', 0)

    // Insert new books
    const { data, error } = await supabase
      .from('knowledge_base')
      .insert(
        books.map((book, index) => ({
          id: index + 1,
          title: book.title,
          author: book.author,
          category: book.category,
          description: '',
          cover_url: '',
          created_at: new Date().toISOString(),
        }))
      )
      .select()

    if (error) {
      console.error('Error inserting books:', error)
      return
    }

    console.log(`Successfully loaded ${data?.length || 0} books!`)
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

loadBooks()
