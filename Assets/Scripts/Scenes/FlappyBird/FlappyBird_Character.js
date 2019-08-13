#pragma strict

public class FlappyBird_Character extends MonoBehaviour {
	private var gravity: float = 24;
	private var xVelocity: float = 6;
	private var jumpVelocity: float = 9;
	
	private var capeUp: Texture;
	private var capeNeutral: Texture;
	private var capeDown: Texture;
	
	private var characterMesh : MeshRenderer;
	
	private var gameplay: FlappyBird_Gameplay;
	
	public function Awake(): void{
		characterMesh = GameObject.Find("Character/Model").GetComponent.<MeshRenderer>();
		
		capeUp = Resources.Load("FlappyBird/cape_up", typeof(Texture)) as Texture;
		capeNeutral = Resources.Load("FlappyBird/cape_neutral", typeof(Texture)) as Texture;
		capeDown = Resources.Load("FlappyBird/cape_down", typeof(Texture)) as Texture;
		
		gameplay = GameObject.Find("Gameplay").GetComponent.<FlappyBird_Gameplay>();
	}
	
	public function OnTriggerEnter(c: Collider){
		if(c.gameObject.tag == "Obstacle"){
			Death();
		}
	}
	
	public function FixedUpdate(): void{
		if(gameplay.started)
			if(gameObject.GetComponent.<Rigidbody>()){
				Gravity();
				
				gameObject.GetComponent.<Rigidbody>().velocity = new Vector3(xVelocity, gameObject.GetComponent.<Rigidbody>().velocity.y, 0f);
				if(gameObject.GetComponent.<Rigidbody>().velocity.y > -10 && gameObject.GetComponent.<Rigidbody>().velocity.y < 1){
					characterMesh.GetComponent.<Renderer>().material.mainTexture = capeNeutral;
				}
			}
	}
	
	public function Update(): void{
		if(Input.GetMouseButtonUp(0)){
				if(gameObject.GetComponent.<Rigidbody>()){
					characterMesh.GetComponent.<Renderer>().material.mainTexture = capeUp;
					GetComponent.<AudioSource>().Play();
					gameObject.GetComponent.<Rigidbody>().velocity = new Vector3(gameObject.GetComponent.<Rigidbody>().velocity.x, jumpVelocity, 0f);
				}
			}
	}
	
	private function Gravity(): void{
		gameObject.GetComponent.<Rigidbody>().velocity += new Vector3(0f, -gravity * Time.deltaTime, 0f);
		
		if(gameObject.GetComponent.<Rigidbody>().velocity.y < 1){
			characterMesh.GetComponent.<Renderer>().material.mainTexture = capeDown;
		}
	}
	
	private function Death(): void{
		// Gameplay.Instance().Death();
		if(!GameObject.Find("GameOver_Popup(Clone)")){
			var popup: GameObject = Instantiate(Resources.Load("FlappyBird/GameOver_Popup", typeof(GameObject)) as GameObject) as GameObject;
			popup.transform.parent = gameplay.transform;
			popup.transform.position = new Vector3(50000f, 50000f, 0f);
			
			var obj:GameObject;
		
			obj = GameObject.Find("CharacterDiedSFX");
			if(!obj){
				obj = Instantiate(Resources.Load("FlappyBird/CharacterDiedSFX", typeof(GameObject)) as GameObject) as GameObject;
				obj.name = obj.name.Split("("[0])[0];
			}
			
			Destroy(gameObject);
			Destroy(this);
		}
	}
	
	// public function PlayMusic(): void{
		// audio.Play();
	// }
	
	private static var instance:FlappyBird_Character;
	
	public static function Instance():FlappyBird_Character {
		if (instance == null) {
			instance = new GameObject("FlappyBird_Character").AddComponent(FlappyBird_Character);
			DontDestroyOnLoad(instance);
		}

		return instance;
	}
}