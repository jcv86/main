-- AUDITORÍA COMPLETA: Verificar cuáles libros tienen contenido completo
SELECT 
  COUNT(*) as total_libros,
  SUM(CASE WHEN LENGTH(content) > 500 THEN 1 ELSE 0 END) as libros_completos,
  SUM(CASE WHEN LENGTH(content) <= 500 THEN 1 ELSE 0 END) as libros_incompletos,
  ROUND(100.0 * SUM(CASE WHEN LENGTH(content) > 500 THEN 1 ELSE 0 END) / COUNT(*), 2) as porcentaje_completo
FROM knowledge_base;

-- MOSTRAR libros incompletos
SELECT id, title, author, LENGTH(content) as content_length
FROM knowledge_base
WHERE LENGTH(content) <= 500
ORDER BY content_length ASC;

-- ENRIQUECER los últimos 4 libros (61-64) que faltan
UPDATE knowledge_base
SET 
  content = 'CONTINUOUS DISCOVERY HABITS by Theresa Torres

CORE CONCEPT: Theresa Torres introduces a structured approach to continuous product discovery that integrates discovery practices into the daily workflow of product teams. Rather than viewing discovery as a phase before building, teams should continuously talk to customers, learn from their feedback, and refine product direction through ongoing conversations.

KEY PRINCIPLES:
- Time Box Product Thinking: Dedicate regular, consistent time to intentional customer conversations and discovery activities
- Focus on Opportunity, Not Solutions: Frame discovery conversations around understanding customer problems and opportunities rather than evaluating specific solutions
- Outcome Over Output: Measure discovery success through knowledge gained and decisions improved, not features shipped
- Inclusive Discovery: Ensure the entire team (engineers, designers, marketing) participates in customer conversations to develop shared understanding

DISCOVERY FRAMEWORK:
1. Talk to customers continuously (not episodically)
2. Identify and prioritize opportunities rather than features
3. Experiment with potential solutions to validate assumptions
4. Measure outcomes to inform future decisions

PROFESSIONAL APPLICATION:
Product managers use this to shift from feature-driven development to opportunity-driven innovation. By building discovery into daily routines, teams reduce costly pivots, build products customers actually want, and create alignment across departments through shared customer understanding.'
WHERE title = 'Continuous Discovery Habits';

UPDATE knowledge_base
SET 
  content = 'INSPIRED by Marty Cagan

CORE CONCEPT: Marty Cagan synthesizes decades of product management experience from companies like eBay, AOL, and Netscape to present practical frameworks for building products that truly engage users. INSPIRED focuses on the relationship between product managers and engineers, emphasizing that great products come from empowered teams with shared vision, not from following specifications.

KEY PRINCIPLES:
- Empowered Product Teams: Engineers and designers are not order-takers; they are empowered to solve problems and propose solutions
- Purpose Before Execution: Teams need clarity on the problem to solve and business objectives, not detailed feature specifications
- Continuous Customer Contact: Product managers must spend significant time understanding customer needs and validating assumptions
- Build to Learn: Release MVPs to learn from real users rather than perfecting products in development

PRODUCT DISCOVERY CYCLE:
1. Understand customer problems and opportunities
2. Generate and evaluate possible solutions
3. Validate most promising solutions with customers
4. Scale successful solutions

PROFESSIONAL APPLICATION:
Product managers and leaders use INSPIRED to transform how organizations approach product development. Instead of traditional waterfall or feature-based planning, create cross-functional teams with clear outcomes rather than detailed specifications, enabling faster iteration and better product-market fit.'
WHERE title = 'Inspired';

UPDATE knowledge_base
SET 
  content = 'BLUE OCEAN STRATEGY by W. Chan Kim & Renée Mauborgne

CORE CONCEPT: Blue Ocean Strategy introduces the framework of competing in uncontested markets (blue oceans) rather than fighting for share in saturated industries (red oceans). By focusing on value innovation—simultaneously pursuing differentiation AND lower costs—organizations can create entirely new market spaces rather than competing on existing competitive factors.

KEY PRINCIPLES:
- Red Ocean vs. Blue Ocean: Red oceans are existing markets where competitors fight for share (red from competition); blue oceans are new, uncontested markets
- Value Innovation: Create new value by eliminating or reducing factors the industry competes on while introducing new factors customers value
- Focus on Non-Customers: Understand why people don''t use your industry''s products and address those reasons
- Strategic Sequence: Focus on feasibility, price, and utility before brand/marketing

THE FOUR ACTIONS FRAMEWORK:
1. ELIMINATE: What factors the industry takes for granted should be eliminated?
2. REDUCE: What factors should be reduced below industry standard?
3. RAISE: What factors should be raised above industry standard?
4. CREATE: What entirely new factors should be created?

PROFESSIONAL APPLICATION:
Strategists use Blue Ocean to break free from competitive traps and create new market opportunities. Instead of competing on traditional factors (price, features, service), identify what customers truly value, eliminate expensive features they don''t need, and create unique value propositions that competitors can''t easily replicate.'
WHERE title = 'Blue Ocean Strategy';

UPDATE knowledge_base
SET 
  content = 'PLAYING TO WIN by A.G. Lafley & Roger L. Martin

CORE CONCEPT: Playing to Win shifts strategy from asking "How do we survive?" to "How do we win?" The authors present a framework showing that winning strategies start with clear choices about where to compete and how to win in those specific places, requiring integrated choices across all business functions.

KEY PRINCIPLES:
- Strategic Choice: Leaders must make clear, specific choices about where to focus rather than trying to be all things to all customers
- Winning Aspiration: Define what winning looks like in your chosen market and what success metrics matter most
- Where to Play: Make specific choices about customer segments, geographies, and product categories to focus on
- How to Win: Define your competitive advantage and what makes you superior in your chosen markets
- Capabilities: Build specific organizational capabilities required to win in your chosen markets
- Management Systems: Align metrics, incentives, and processes to support your winning strategy

STRATEGIC QUESTIONS:
1. What is your winning aspiration?
2. Where will you play (which markets, customers, geographies)?
3. How will you win? (What is your competitive advantage?)
4. What capabilities must you build?
5. What management systems will enable your strategy?

PROFESSIONAL APPLICATION:
Executives use this framework to move from vague strategic statements to clear, actionable competitive strategy. Instead of generic goals like "be customer-focused," Playing to Win requires specific choices that drive all organizational decisions and resource allocation.'
WHERE title = 'Playing to Win';

-- VERIFICACIÓN FINAL
SELECT 
  COUNT(*) as total_libros,
  SUM(CASE WHEN LENGTH(content) > 500 THEN 1 ELSE 0 END) as libros_completos_ahora,
  SUM(CASE WHEN LENGTH(content) <= 500 THEN 1 ELSE 0 END) as libros_incompletos_restantes,
  ROUND(100.0 * SUM(CASE WHEN LENGTH(content) > 500 THEN 1 ELSE 0 END) / COUNT(*), 2) as porcentaje_completo_final
FROM knowledge_base;
