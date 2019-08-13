#pragma strict

public class FlappyBird_CameraFollow extends MonoBehaviour {
	private var yOffset: float = 4;
	private var xOffset: float = -2;
	
	private var character: GameObject = null;
	
	private var bounds: Transform;
	
	private var main: Camera = null;
	
	public function Awake(): void{
		character = GameObject.Find("Character");
		main = Camera.main;
		bounds = transform.Find("Bounds");
	}
	
	public function LateUpdate(): void{
		if(character)
			if(character.transform.position.x > main.transform.position.x + xOffset){
					main.transform.position = new Vector3(character.transform.position.x - xOffset, 0f, -10f);
			}
	}
}